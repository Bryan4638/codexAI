import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { LiveCodingSession } from '../entities/live-coding-session.entity';
import { SyncLiveCodingDto } from '../dto/sync-live-coding.dto';

@Injectable()
export class SyncLiveCodingUseCase {
    constructor(
        @InjectRepository(LiveCodingSession)
        private readonly sessionRepo: Repository<LiveCodingSession>,
    ) { }

    async execute(userId: string, dto: SyncLiveCodingDto) {
        const session = await this.sessionRepo.findOne({
            where: {
                id: dto.sessionId,
                userId,
                completedAt: IsNull(),
            },
        });

        if (!session) {
            throw new NotFoundException('Sesión activa no encontrada');
        }

        // Apply new values (keeping max to avoid reversing penalties artificially)
        if (dto.code !== undefined) {
            session.code = dto.code;
        }
        if (dto.tabSwitches !== undefined && dto.tabSwitches > session.tabSwitches) {
            session.tabSwitches = dto.tabSwitches;
        }
        if (dto.copyPasteCount !== undefined && dto.copyPasteCount > session.copyPasteCount) {
            session.copyPasteCount = dto.copyPasteCount;
        }

        await this.sessionRepo.save(session);

        return { success: true };
    }
}
