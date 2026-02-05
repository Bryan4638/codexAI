import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty({ message: 'El título es requerido' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'El código inicial es requerido' })
  initialCode: string;

  @IsArray()
  @IsNotEmpty({ message: 'Los test cases son requeridos' })
  testCases: unknown[];

  @IsString()
  @IsNotEmpty({ message: 'La dificultad es requerida' })
  difficulty: string;
}
