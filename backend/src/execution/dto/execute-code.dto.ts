import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class ExecuteCodeDto {
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
