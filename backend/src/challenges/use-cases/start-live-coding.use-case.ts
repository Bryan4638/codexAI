import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
        // Build query for random challenge
        const queryBuilder = this.challengeRepo
            .createQueryBuilder('challenge')
            .leftJoinAndSelect('challenge.tests', 'tests');

        if (dto.difficulty) {
            queryBuilder.where('challenge.difficulty = :difficulty', {
                difficulty: dto.difficulty,
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

        // Return challenge with only visible tests
        const visibleTests = (challenge.tests || [])
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
            challenge: {
                id: challenge.id,
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                initialCode: challenge.initialCode,
                tests: visibleTests,
            },
        };
    }
}
