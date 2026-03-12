import { IsNotEmpty, IsString, IsUUID, IsInt, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitLiveCodingDto {
    @ApiProperty({
        description: 'ID de la sesión de live coding',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsUUID('4', { message: 'El sessionId debe ser un UUID válido' })
    @IsNotEmpty()
    sessionId: string;

    @ApiProperty({
        description: 'Código final del usuario',
        example: 'function sum(a, b) { return a + b; }',
    })
    @IsString()
    @IsNotEmpty({ message: 'El código es requerido' })
    code: string;

    @ApiProperty({
        description: 'Lenguaje de programación',
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
        description: 'Tiempo en segundos que tardó el usuario',
        example: 120,
    })
    @IsInt()
    @Min(0)
    timeTakenSeconds: number;

    @ApiProperty({
        description: 'Número de veces que cambió de pestaña',
        example: 2,
    })
    @IsInt()
    @Min(0)
    tabSwitches: number;

    @ApiProperty({
        description: 'Número de veces que pegó código',
        example: 1,
    })
    @IsInt()
    @Min(0)
    pasteCount: number;
}
