import { Injectable } from '@nestjs/common';
import { ValidateExerciseDto } from '../dto/validate-exercise.dto';
import { GetAllExercisesUseCase } from '../use-cases/get-all-exercises.use-case';
import { GetExerciseByIdUseCase } from '../use-cases/get-exercise-by-id.use-case';
import { ValidateExerciseUseCase } from '../use-cases/validate-exercise.use-case';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly getAllExercisesUseCase: GetAllExercisesUseCase,
    private readonly getExerciseByIdUseCase: GetExerciseByIdUseCase,
    private readonly validateExerciseUseCase: ValidateExerciseUseCase,
  ) {}

  async getAllExercises(lessonId?: string, difficulty?: string) {
    return this.getAllExercisesUseCase.execute({
      lessonId,
      difficulty,
    });
  }

  async getExerciseById(id: string) {
    return this.getExerciseByIdUseCase.execute(id);
  }

  async validateExercise(userId: string, dto: ValidateExerciseDto) {
    return this.validateExerciseUseCase.execute(userId, dto);
  }
}
