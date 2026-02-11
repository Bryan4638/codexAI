import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserProgress } from '../../auth/entities/user-progress.entity';
import { exercises, getExerciseById } from '../../scripts/data/exercises.data';

export interface ModuleProgress {
  total: number;
  completed: number;
}

export interface GetUserProgressResult {
  xp: number;
  level: number;
  nextLevelXp: number;
  levelProgress: number;
  totalExercises: number;
  completedExercises: number;
  completedLessons: string[];
  moduleProgress: Record<number, ModuleProgress>;
  recentActivity: {
    exercise_id: string;
    completed_at: Date;
    attempts: number;
  }[];
  history: {
    id: string;
    title: string;
    completedAt: Date;
    attempts: number;
  }[];
}

@Injectable()
export class GetUserProgressUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProgress)
    private readonly userProgressRepository: Repository<UserProgress>,
  ) {}

  async execute(userId: string): Promise<GetUserProgressResult> {
    // Obtener usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['xp', 'level'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener ejercicios completados
    const completedExercises = await this.userProgressRepository.find({
      where: { userId },
      select: ['exerciseId', 'completedAt', 'attempts'],
      order: { completedAt: 'DESC' },
    });

    // Calcular progreso por módulo
    const moduleProgress: Record<number, ModuleProgress> = {};

    [1, 2, 3, 4].forEach((moduleId) => {
      const moduleExercises = exercises.filter((e) => e.moduleId === moduleId);
      const completedInModule = completedExercises.filter((ce) => {
        const ex = getExerciseById(ce.exerciseId);
        return ex && ex.moduleId === moduleId;
      });

      moduleProgress[moduleId] = {
        total: moduleExercises.length,
        completed: completedInModule.length,
      };
    });

    // Calcular XP para siguiente nivel
    const nextLevelXp = Math.pow(user.level, 2) * 100;
    const prevLevelXp = Math.pow(user.level - 1, 2) * 100;
    const levelProgress =
      ((user.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

    // Calcular lecciones completadas
    const completedLessons: string[] = [];
    const lessons = Array.from(new Set(exercises.map((e) => e.lessonId)));

    lessons.forEach((lessonId) => {
      const lessonExercises = exercises.filter((e) => e.lessonId === lessonId);
      const isCompleted = lessonExercises.every((le) =>
        completedExercises.some((ce) => ce.exerciseId === le.id),
      );

      if (isCompleted && lessonExercises.length > 0) {
        completedLessons.push(lessonId);
      }
    });

    return {
      xp: user.xp,
      level: user.level,
      nextLevelXp,
      levelProgress: Math.min(100, Math.max(0, levelProgress)),
      totalExercises: exercises.length,
      completedExercises: completedExercises.length,
      completedLessons,
      moduleProgress,
      recentActivity: completedExercises.slice(0, 10).map((ce) => ({
        exercise_id: ce.exerciseId,
        completed_at: ce.completedAt,
        attempts: ce.attempts,
      })),
      history: completedExercises.map((ce) => {
        const ex = getExerciseById(ce.exerciseId);
        return {
          id: ce.exerciseId,
          title: ex ? ex.prompt : 'Ejercicio desconocido',
          completedAt: ce.completedAt,
          attempts: ce.attempts,
        };
      }),
    };
  }
}
