import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserProgress } from '../../auth/entities/user-progress.entity';
import { UserBadge } from '../../auth/entities/user-badge.entity';
import { Exercise } from '../entities/exercise.entity';
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

    // Obtener ejercicios completados por módulo (usando moduleNumber)
    const completedExercises = await this.userProgressRepository.find({
      where: { userId },
      select: ['exerciseId'],
    });

    // Contar completados por número de módulo
    const completedByModule: Record<number, number> = {};

    // Necesitamos obtener el módulo de cada ejercicio completado
    // Para optimizar, podríamos hacer un join en la query anterior, pero userProgress no tiene relación directa con Exercise en TypeORM definida en entity (solo exerciseId string).
    // Así que buscaremos los ejercicios.

    if (completedExercises.length > 0) {
      const exerciseIds = completedExercises.map((ue) => ue.exerciseId);

      // Buscar detalles de exercises para saber su moduleNumber
      // Usamos chunks si hay muchos, pero por ahora asumimos razonable.
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
          const moduleId = badge.requirement.moduleId!; // This is moduleNumber
          // Count total exercises in this module
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
