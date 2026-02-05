import { Injectable, NotFoundException } from '@nestjs/common';
import { getExerciseById } from '../data/exercises.data';
import { Exercise } from '../../common/types';

export interface GetExerciseByIdResult {
  exercise: Partial<Exercise>;
}

@Injectable()
export class GetExerciseByIdUseCase {
  execute(id: string): GetExerciseByIdResult {
    const exercise = getExerciseById(id);

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    // No enviar soluciones
    const { data, ...rest } = exercise;
    const safeData = {
      ...data,
      solutions: undefined,
      correctAnswer: undefined,
      correctOrder: undefined,
    };

    return { exercise: { ...rest, data: safeData } };
  }
}
