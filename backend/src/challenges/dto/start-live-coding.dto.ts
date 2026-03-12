import { IsOptional, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StartLiveCodingDto {
    @ApiPropertyOptional({
        description: 'Filtrar por dificultad (opcional, si no se envía se asigna aleatorio)',
        example: 'medium',
        enum: ['easy', 'medium', 'hard'],
    })
    @IsOptional()
    @IsIn(['easy', 'medium', 'hard'], {
        message: 'La dificultad debe ser: easy, medium o hard',
    })
    difficulty?: 'easy' | 'medium' | 'hard';
}
