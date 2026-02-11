import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';

// Safe exercise type without solutions
export interface SafeExercise {
  id: string;
  type: string;
  difficulty: string;
  xpReward: number;
  prompt: string;
  data: Record<string, unknown>;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllExercisesResult {
  exercises: SafeExercise[];
}

@Injectable()
export class GetAllExercisesUseCase {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async execute(filters?: {
    lessonId?: string;
    difficulty?: string;
  }): Promise<GetAllExercisesResult> {
    const query = this.exerciseRepository.createQueryBuilder('exercise');

    if (filters?.lessonId) {
      query.andWhere('exercise.lessonId = :lessonId', {
        lessonId: filters.lessonId,
      });
    }
    if (filters?.difficulty) {
      query.andWhere('exercise.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    const exercises = await query.getMany();

    // No enviar las soluciones al cliente
    const safeExercises: SafeExercise[] = exercises.map(
      ({ data, ...rest }) => ({
        ...rest,
        data: {
          ...data,
          solutions: undefined,
          correctAnswer: undefined,
          correctOrder: undefined,
          blanks: (data.blanks as { id: number }[])?.map((b) => ({ id: b.id })),
        },
      }),
    );

    return { exercises: safeExercises };
  }
}
