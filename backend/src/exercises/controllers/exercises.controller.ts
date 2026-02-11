import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';
import { ValidateExerciseDto } from '../dto/validate-exercise.dto';
import { ExercisesService } from '../services/exercises.service';

@ApiTags('Exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los ejercicios' })
  @ApiQuery({
    name: 'lessonId',
    required: false,
    description: 'Filtrar por ID de lección',
  })
  @ApiQuery({
    name: 'difficulty',
    required: false,
    description: 'Filtrar por dificultad (easy, medium, hard)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ejercicios obtenida exitosamente',
  })
  getAllExercises(
    @Query('lessonId') lessonId?: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.exercisesService.getAllExercises(lessonId, difficulty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ejercicio por ID' })
  @ApiResponse({ status: 200, description: 'Ejercicio encontrado' })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  getExercise(@Param('id') id: string) {
    return this.exercisesService.getExerciseById(id);
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Validar solución de ejercicio' })
  @ApiResponse({ status: 200, description: 'Ejercicio validado correctamente' })
  @ApiResponse({ status: 400, description: 'Solución incorrecta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  validateExercise(
    @CurrentUser() user: User,
    @Body() dto: ValidateExerciseDto,
  ) {
    return this.exercisesService.validateExercise(user.id, dto);
  }
}
