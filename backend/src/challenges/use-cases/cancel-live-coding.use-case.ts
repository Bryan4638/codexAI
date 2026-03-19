import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LiveCodingSession } from '../entities/live-coding-session.entity';

@Injectable()
export class CancelLiveCodingUseCase {
    constructor(
        @InjectRepository(LiveCodingSession)
        private readonly sessionRepo: Repository<LiveCodingSession>,
    ) { }

    async execute(userId: string) {
        // Encontrar sesión activa
        const activeSession = await this.sessionRepo.findOne({
            where: {
                userId,
                completedAt: IsNull(),
            },
        });

        if (!activeSession) {
            throw new NotFoundException('No tienes ninguna sesión de Live Coding activa.');
        }

        // Eliminamos la sesión para que no contamine la BD
        await this.sessionRepo.remove(activeSession);

        return {
            success: true,
            message: 'Sesión de Live Coding cancelada y eliminada.',
        };
    }
}
