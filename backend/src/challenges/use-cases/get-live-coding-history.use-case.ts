import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { LiveCodingSession } from '../entities/live-coding-session.entity';

@Injectable()
export class GetLiveCodingHistoryUseCase {
    constructor(
        @InjectRepository(LiveCodingSession)
        private readonly sessionRepo: Repository<LiveCodingSession>,
    ) { }

    async execute(userId: string, page = 1, limit = 10) {
        const [sessions, total] = await this.sessionRepo.findAndCount({
            where: { userId, completedAt: Not(IsNull()) },
            relations: ['challenge'],
            order: { completedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: sessions.map((s) => ({
                id: s.id,
                challenge: {
                    id: s.challenge.id,
                    title: s.challenge.title,
                    difficulty: s.challenge.difficulty,
                },
                score: s.score,
                timeTakenSeconds: s.timeTakenSeconds,
                executionTimeMs: s.executionTimeMs,
                allTestsPassed: s.allTestsPassed,
                tabSwitches: s.tabSwitches,
                copyPasteCount: s.copyPasteCount,
                penaltiesApplied: s.penaltiesApplied,
                completedAt: s.completedAt,
            })),
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                limit,
            },
        };
    }
}
