import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { ValidateExerciseDto } from './dto/validate-exercise.dto';
import { GetAllExercisesUseCase } from './use-cases/get-all-exercises.use-case';
import { GetExerciseByIdUseCase } from './use-cases/get-exercise-by-id.use-case';
import { ValidateExerciseUseCase } from './use-cases/validate-exercise.use-case';

@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly getAllExercisesUseCase: GetAllExercisesUseCase,
    private readonly getExerciseByIdUseCase: GetExerciseByIdUseCase,
    private readonly validateExerciseUseCase: ValidateExerciseUseCase,
  ) {}

  @Get()
  getAllExercises(
    @Query('lessonId') lessonId?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.getAllExercisesUseCase.execute({
      lessonId,
      difficulty,
    });
  }

  @Get(':id')
  getExercise(@Param('id') id: string) {
    return this.getExerciseByIdUseCase.execute(id);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  validateExercise(
    @CurrentUser() user: User,
    @Body() dto: ValidateExerciseDto,
  ) {
    return this.validateExerciseUseCase.execute(user.id, dto);
  }
}
