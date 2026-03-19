import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserProgress } from '../../auth/entities/user-progress.entity';
import { UserBadge } from '../../auth/entities/user-badge.entity';
import { Exercise } from '../entities/exercise.entity';
import { UserStreak } from '../../streaks/entities/user-streak.entity';
import { LiveCodingSession } from '../../challenges/entities/live-coding-session.entity';
import { UserChallengeProgress } from '../../challenges/entities/user-challenge-progress.entity';
import { badges } from '../../badges/data/badges.data';
import { Badge } from '../../common/types';

@Injectable()
export class CheckAndUnlockBadgesUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProgress)
    private readonly userProgressRepository: Repository<UserProgress>,
    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(UserStreak)
    private readonly streakRepository: Repository<UserStreak>,
    @InjectRepository(LiveCodingSession)
    private readonly liveCodingSessionRepository: Repository<LiveCodingSession>,
    @InjectRepository(UserChallengeProgress)
    private readonly challengeProgressRepository: Repository<UserChallengeProgress>,
  ) {}

  async execute(userId: string): Promise<Badge[]> {
    const unlockedBadges: Badge[] = [];

    // Obtener estadísticas del usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['xp', 'level'],
    });

    if (!user) return [];

    // Obtener badges ya desbloqueadas para evitar queries innecesarias
    const existingBadges = await this.userBadgeRepository.find({
      where: { userId },
      select: ['badgeId'],
    });
    const unlockedIds = new Set(existingBadges.map((ub) => ub.badgeId));

    // Filtrar solo badges que aún no tiene
    const pendingBadges = badges.filter((b) => !unlockedIds.has(b.id));
    if (pendingBadges.length === 0) return [];

    // Recopilar los tipos necesarios para este batch
    const neededTypes = new Set(pendingBadges.map((b) => b.requirement.type));

    // ── Cargar estadísticas bajo demanda ──

    let completedExercisesCount = 0;
    let completedByModule: Record<number, number> = {};

    if (
      neededTypes.has('exercises_completed') ||
      neededTypes.has('module_completed')
    ) {
      const completedExercises = await this.userProgressRepository.find({
        where: { userId },
        select: ['exerciseId'],
      });
      completedExercisesCount = completedExercises.length;

      if (neededTypes.has('module_completed') && completedExercises.length > 0) {
        const exerciseIds = completedExercises.map((ue) => ue.exerciseId);
        const exercisesDetails = await this.exerciseRepository
          .createQueryBuilder('exercise')
          .leftJoinAndSelect('exercise.lesson', 'lesson')
          .leftJoinAndSelect('lesson.module', 'module')
          .where('exercise.id IN (:...ids)', { ids: exerciseIds })
          .getMany();

        exercisesDetails.forEach((ex) => {
          const modNum = ex.lesson.module.moduleNumber;
          completedByModule[modNum] = (completedByModule[modNum] || 0) + 1;
        });
      }
    }

    let streakData: { currentStreak: number; longestStreak: number } | null =
      null;
    if (neededTypes.has('streak')) {
      const streak = await this.streakRepository.findOne({
        where: { userId },
      });
      streakData = streak
        ? {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
          }
        : { currentStreak: 0, longestStreak: 0 };
    }

    let challengesCompletedCount = 0;
    if (neededTypes.has('challenges_completed')) {
      challengesCompletedCount = await this.challengeProgressRepository.count({
        where: { user: { id: userId } },
      });
    }

    let cleanLiveCodingCount = 0;
    if (neededTypes.has('live_coding_no_copy')) {
      cleanLiveCodingCount = await this.liveCodingSessionRepository.count({
        where: {
          userId,
          allTestsPassed: true,
          copyPasteCount: 0,
        },
      });
    }

    let fastCompletionCount = 0;
    if (neededTypes.has('fast_completion')) {
      // Sessions completed in under 5 minutes (300 seconds) with all tests passed
      fastCompletionCount = await this.liveCodingSessionRepository
        .createQueryBuilder('session')
        .where('session.userId = :userId', { userId })
        .andWhere('session.allTestsPassed = true')
        .andWhere('session.completedAt IS NOT NULL')
        .andWhere('session.timeTakenSeconds < 300')
        .getCount();
    }

    // ── Evaluar cada badge pendiente ──

    for (const badge of pendingBadges) {
      let shouldUnlock = false;

      switch (badge.requirement.type) {
        case 'exercises_completed':
          shouldUnlock = completedExercisesCount >= badge.requirement.value;
          break;

        case 'level_reached':
          shouldUnlock = user.level >= badge.requirement.value;
          break;

        case 'module_completed': {
          const moduleId = badge.requirement.moduleId!;
          const moduleExercisesCount = await this.exerciseRepository
            .createQueryBuilder('exercise')
            .leftJoin('exercise.lesson', 'lesson')
            .leftJoin('lesson.module', 'module')
            .where('module.moduleNumber = :modNum', { modNum: moduleId })
            .getCount();

          shouldUnlock =
            (completedByModule[moduleId] || 0) >= moduleExercisesCount &&
            moduleExercisesCount > 0;
          break;
        }

        case 'streak':
          shouldUnlock =
            (streakData?.longestStreak ?? 0) >= badge.requirement.value;
          break;

        case 'challenges_completed':
          shouldUnlock =
            challengesCompletedCount >= badge.requirement.value;
          break;

        case 'live_coding_no_copy':
          shouldUnlock =
            cleanLiveCodingCount >= badge.requirement.value;
          break;

        case 'fast_completion':
          shouldUnlock =
            fastCompletionCount >= badge.requirement.value;
          break;
      }

      if (shouldUnlock) {
        const newBadge = this.userBadgeRepository.create({
          userId,
          badgeId: badge.id,
        });
        await this.userBadgeRepository.save(newBadge);
        unlockedBadges.push(badge);
      }
    }

    return unlockedBadges;
  }
}
