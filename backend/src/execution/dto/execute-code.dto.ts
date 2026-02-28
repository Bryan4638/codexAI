import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteCodeDto {
  @ApiProperty({
    description: 'El lenguaje de programación a ejecutar',
    example: 'javascript',
    enum: ['javascript', 'python', 'java', 'csharp'],
  })
  @IsString()
  @IsNotEmpty({ message: 'El lenguaje es requerido' })
  @IsIn(['javascript', 'python', 'java', 'csharp'], {
    message:
      'Lenguaje no soportado. Soportados: javascript, python, java, csharp',
  })
  language: 'javascript' | 'python' | 'java' | 'csharp';

  @ApiProperty({
    description: 'El código fuente a ejecutar',
    example: 'console.log("Hola Mundo");',
  })
  @IsString()
  @IsNotEmpty({ message: 'El código es requerido' })
  code: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
