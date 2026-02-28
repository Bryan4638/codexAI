import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';

export class ExecuteWithTestsDto {
  @IsUUID('4', { message: 'El ID del ejercicio debe ser un UUID válido' })
  @IsNotEmpty()
  exerciseId: string;

  @IsString()
  @IsIn(['javascript', 'python', 'java', 'csharp'], {
    message:
      'Lenguaje no soportado. Soportados: javascript, python, java, csharp',
  })
  language: 'javascript' | 'python' | 'java' | 'csharp';

  @IsString()
  @IsNotEmpty({ message: 'El código es requerido' })
  code: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
