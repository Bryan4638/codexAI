import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../entities/exercise.entity';

export interface GetExerciseByIdResult {
  exercise: Partial<Exercise>;
}

@Injectable()
export class GetExerciseByIdUseCase {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
  ) {}

  async execute(id: string): Promise<GetExerciseByIdResult> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id },
      relations: ['lesson', 'lesson.module'],
    });

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
