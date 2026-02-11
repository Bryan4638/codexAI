import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsIn,
  IsObject,
  Min,
} from 'class-validator';
import type {
  ExerciseType,
  ExerciseDifficulty,
} from '../entities/exercise.entity';

export class CreateExerciseDto {
  @IsIn(['code', 'quiz', 'dragDrop', 'fillBlank'])
  type: ExerciseType;

  @IsIn(['beginner', 'intermediate', 'advanced'])
  difficulty: ExerciseDifficulty;

  @IsInt()
  @IsOptional()
  @Min(0)
  xpReward?: number;

  @IsString()
  prompt: string;

  @IsObject()
  data: Record<string, unknown>;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  lessonId: string;
}

export class UpdateExerciseDto {
  @IsIn(['code', 'quiz', 'dragDrop', 'fillBlank'])
  @IsOptional()
  type?: ExerciseType;

  @IsIn(['beginner', 'intermediate', 'advanced'])
  @IsOptional()
  difficulty?: ExerciseDifficulty;

  @IsInt()
  @IsOptional()
  @Min(0)
  xpReward?: number;

  @IsString()
  @IsOptional()
  prompt?: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;

  @IsInt()
  @IsOptional()
  @Min(0)
  order?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  @IsOptional()
  lessonId?: string;
}
