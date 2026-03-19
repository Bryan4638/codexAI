import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { LiveCodingSession } from '../entities/live-coding-session.entity';
import { StartLiveCodingDto } from '../dto/start-live-coding.dto';

@Injectable()
export class StartLiveCodingUseCase {
    constructor(
        @InjectRepository(Challenge)
        private readonly challengeRepo: Repository<Challenge>,
        @InjectRepository(LiveCodingSession)
        private readonly sessionRepo: Repository<LiveCodingSession>,
    ) { }

    async execute(userId: string, dto: StartLiveCodingDto) {
        // 1. Check if user already has an active session
        const activeSession = await this.sessionRepo.findOne({
            where: {
                userId,
                completedAt: IsNull(),
            },
            relations: ['challenge', 'challenge.tests'],
        });

        if (activeSession) {
            // Penalize abandonment/reload by incrementing tab switches
            activeSession.tabSwitches += 1;
            await this.sessionRepo.save(activeSession);

            // Calculate elapsed time robustly using DB instead of node clocks
            const [{ elapsed }] = await this.sessionRepo.query(
                'SELECT EXTRACT(EPOCH FROM (NOW() - started_at)) as elapsed FROM live_coding_sessions WHERE id = $1',
                [activeSession.id]
            );
            const elapsedSeconds = Math.max(0, Math.floor(elapsed));

            const visibleTests = (activeSession.challenge.tests || [])
                .filter((t) => !t.isHidden)
                .sort((a, b) => a.order - b.order)
                .map((t) => ({
                    id: t.id,
                    description: t.description,
                    input: t.input,
                    expectedOutput: t.expectedOutput,
                }));

            return {
                sessionId: activeSession.id,
                startedAt: activeSession.startedAt,
                elapsedSeconds,
                code: activeSession.code || '',
                tabSwitches: activeSession.tabSwitches,
                copyPasteCount: activeSession.copyPasteCount,
                challenge: {
                    id: activeSession.challenge.id,
                    title: activeSession.challenge.title,
                    description: activeSession.challenge.description,
                    difficulty: activeSession.challenge.difficulty,
                    initialCode: activeSession.challenge.initialCode,
                    tests: visibleTests,
                },
            };
        }

        // 2. Build query for random challenge
        const queryBuilder = this.challengeRepo
            .createQueryBuilder('challenge')
            .leftJoinAndSelect('challenge.tests', 'tests');

        if (dto.difficulty) {
            queryBuilder.where('challenge.difficulty = :difficulty', {
                difficulty: "Fácil",
            });
        }

        // Get count and pick random
        const count = await queryBuilder.getCount();
        if (count === 0) {
            throw new NotFoundException(
                'No hay retos disponibles' +
                (dto.difficulty ? ` con dificultad "${dto.difficulty}"` : ''),
            );
        }

        const randomOffset = Math.floor(Math.random() * count);
        const challenge = await queryBuilder
            .skip(randomOffset)
            .take(1)
            .getOne();

        if (!challenge) {
            throw new NotFoundException('No se pudo obtener un reto aleatorio');
        }

        // Create session
        const session = this.sessionRepo.create({
            userId,
            challengeId: challenge.id,
        });
        const savedSession = await this.sessionRepo.save(session);

        const returnVisibleTests = (challenge.tests || [])
            .filter((t) => !t.isHidden)
            .sort((a, b) => a.order - b.order)
            .map((t) => ({
                id: t.id,
                description: t.description,
                input: t.input,
                expectedOutput: t.expectedOutput,
            }));

        return {
            sessionId: savedSession.id,
            startedAt: savedSession.startedAt,
            elapsedSeconds: 0,
            code: savedSession.code || '',
            tabSwitches: savedSession.tabSwitches,
            copyPasteCount: savedSession.copyPasteCount,
            challenge: {
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                initialCode: challenge.initialCode,
                tests: returnVisibleTests,
            },
        };
    }
}
