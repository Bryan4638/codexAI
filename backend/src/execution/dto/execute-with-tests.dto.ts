import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteWithTestsDto {
  @ApiProperty({
    description: 'ID de Base de datos del Reto a evaluar',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsUUID('4', { message: 'El ID del reto debe ser un UUID válido' })
  @IsNotEmpty()
  challengeId: string;

  @ApiProperty({
    description: 'Lenguaje en el que el código está escrito',
    example: 'javascript',
    enum: ['javascript', 'python', 'java', 'csharp'],
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['javascript', 'python', 'java', 'csharp'], {
    message:
      'Lenguaje no soportado. Soportados: javascript, python, java, csharp',
  })
  language: 'javascript' | 'python' | 'java' | 'csharp';

  @ApiProperty({
    description: 'Código a ejecutar',
    example: 'console.log("Hello World");',
  })
  @IsString()
  @IsNotEmpty({ message: 'El código es requerido' })
  code: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
