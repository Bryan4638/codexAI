import { Injectable } from '@nestjs/common';
import { exercises } from '../data/exercises.data';

// Safe exercise type without solutions
export interface SafeExercise {
  id: string;
  moduleId: number;
  lessonId: string;
  type: 'code' | 'quiz' | 'dragDrop' | 'fillBlank';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  prompt: string;
  data: Record<string, unknown>;
}

export interface GetAllExercisesResult {
  exercises: SafeExercise[];
}

@Injectable()
export class GetAllExercisesUseCase {
  execute(filters?: {
    moduleId?: number;
    lessonId?: string;
    difficulty?: string;
  }): GetAllExercisesResult {
    let filtered = exercises;

    if (filters?.moduleId) {
      filtered = filtered.filter((e) => e.moduleId === filters.moduleId);
    }
    if (filters?.lessonId) {
      filtered = filtered.filter((e) => e.lessonId === filters.lessonId);
    }
    if (filters?.difficulty) {
      filtered = filtered.filter((e) => e.difficulty === filters.difficulty);
    }

    // No enviar las soluciones al cliente
    const safeExercises: SafeExercise[] = filtered.map(({ data, ...rest }) => ({
      ...rest,
      data: {
        ...data,
        solutions: undefined,
        correctAnswer: undefined,
        correctOrder: undefined,
        blanks: data.blanks?.map((b) => ({ id: b.id })),
      },
    }));

    return { exercises: safeExercises };
  }
}
