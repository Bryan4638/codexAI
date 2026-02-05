import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateExerciseDto {
  @IsString()
  @IsNotEmpty({ message: 'exerciseId es requerido' })
  exerciseId: string;

  @IsNotEmpty({ message: 'answer es requerido' })
  answer: unknown;
}
