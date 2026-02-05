import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserProgress } from '../../auth/entities/user-progress.entity';
import { UserBadge } from '../../auth/entities/user-badge.entity';
import { badges } from '../../badges/data/badges.data';
import { exercises, getExerciseById } from '../data/exercises.data';
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
  ) {}

  async execute(userId: string): Promise<Badge[]> {
    const unlockedBadges: Badge[] = [];

    // Obtener estadísticas del usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['xp', 'level'],
    });

    if (!user) return [];

    const completedCount = await this.userProgressRepository.count({
      where: { userId },
    });

    // Obtener ejercicios completados por módulo
    const completedExercises = await this.userProgressRepository.find({
      where: { userId },
      select: ['exerciseId'],
    });

    const completedByModule: Record<number, number> = {};
    completedExercises.forEach(({ exerciseId }) => {
      const exercise = getExerciseById(exerciseId);
      if (exercise) {
        completedByModule[exercise.moduleId] =
          (completedByModule[exercise.moduleId] || 0) + 1;
      }
    });

    // Verificar cada medalla
    for (const badge of badges) {
      // Verificar si ya tiene la medalla
      const hasBadge = await this.userBadgeRepository.findOne({
        where: { userId, badgeId: badge.id },
      });

      if (hasBadge) continue;

      let shouldUnlock = false;

      switch (badge.requirement.type) {
        case 'exercises_completed':
          shouldUnlock = completedCount >= badge.requirement.value;
          break;
        case 'level_reached':
          shouldUnlock = user.level >= badge.requirement.value;
          break;
        case 'module_completed': {
          const moduleId = badge.requirement.moduleId!;
          const moduleExercises = exercises.filter(
            (e) => e.moduleId === moduleId,
          ).length;
          shouldUnlock = (completedByModule[moduleId] || 0) >= moduleExercises;
          break;
        }
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
