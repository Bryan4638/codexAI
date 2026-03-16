import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveCodingSession } from '../entities/live-coding-session.entity';
import { ChallengeTest } from '../entities/challenge-test.entity';
import { Challenge } from '../entities/challenge.entity';
import { SubmitLiveCodingDto } from '../dto/submit-live-coding.dto';
import { QueueManagerService } from '../../execution/services/queue-manager.service';

const DIFFICULTY_BASE_SCORE: Record<string, number> = {
    easy: 100,
    medium: 200,
    hard: 300,
};

const MAX_TIME_SECONDS = 1800; // 30 minutes
const TAB_SWITCH_PENALTY = 15;
const COPY_PASTE_PENALTY = 25;
const TIME_BONUS_MAX = 50;

@Injectable()
export class SubmitLiveCodingUseCase {
    constructor(
        @InjectRepository(LiveCodingSession)
        private readonly sessionRepo: Repository<LiveCodingSession>,
        @InjectRepository(ChallengeTest)
        private readonly challengeTestRepo: Repository<ChallengeTest>,
        @InjectRepository(Challenge)
        private readonly challengeRepo: Repository<Challenge>,
        private readonly queueManager: QueueManagerService,
    ) { }

    async execute(userId: string, dto: SubmitLiveCodingDto) {
        const { sessionId, code, language, timeTakenSeconds, tabSwitches, copyPasteCount } = dto;

        // Validate session
        const session = await this.sessionRepo.findOne({
            where: { id: sessionId, userId },
            relations: ['challenge'],
        });

        if (!session) {
            throw new NotFoundException('Sesión de live coding no encontrada');
        }

        if (session.completedAt) {
            throw new BadRequestException('Esta sesión ya fue completada');
        }

        const challenge = session.challenge;

        // Get tests for the challenge
        const tests = await this.challengeTestRepo.find({
            where: { challenge: { id: challenge.id } },
            order: { order: 'ASC' },
        });

        if (!tests || tests.length === 0) {
            throw new NotFoundException(
                `No se encontraron tests para el reto ${challenge.id}`,
            );
        }

        // Execute code against tests
        const testCases = tests.map((t) => ({
            id: t.id,
            input: t.input,
            expectedOutput: t.expectedOutput,
        }));

        const job = await this.queueManager.addJob({
            language,
            code,
            userId,
            timeout: 15000,
            tests: testCases,
        });

        let executionResult: any;
        try {
            executionResult = await job.finished();
        } catch (jobError: unknown) {
            executionResult = {
                allPassed: false,
                testResults: [],
                executionTimeMs: 0,
                error:
                    jobError instanceof Error ? jobError.message : 'Execution failed',
            };
        }

        const allPassed = executionResult?.allPassed ?? false;
        const executionTimeMs =
            typeof executionResult?.executionTimeMs === 'number'
                ? executionResult.executionTimeMs
                : 0;

        // Calculate score
        const totalTests = tests.length;
        const passedTests = executionResult?.testResults
            ? executionResult.testResults.filter((tr: any) => tr.passed).length
            : 0;

        const baseDifficulty =
            DIFFICULTY_BASE_SCORE[challenge.difficulty] || 100;
        const timeBonus =
            Math.max(0, 1 - timeTakenSeconds / MAX_TIME_SECONDS) * TIME_BONUS_MAX;
        const testMultiplier = totalTests > 0 ? passedTests / totalTests : 0;
        const penalty =
            tabSwitches * TAB_SWITCH_PENALTY + copyPasteCount * COPY_PASTE_PENALTY;

        const score = Math.max(
            0,
            Math.round((baseDifficulty + timeBonus) * testMultiplier - penalty),
        );

        // Update session
        session.code = code;
        session.timeTakenSeconds = timeTakenSeconds;
        session.executionTimeMs = executionTimeMs;
        session.score = score;
        session.tabSwitches = tabSwitches;
        session.copyPasteCount = copyPasteCount;
        session.penaltiesApplied = penalty;
        session.allTestsPassed = allPassed;
        session.completedAt = new Date();

        await this.sessionRepo.save(session);

        // Filter to only show public test results
        const publicResults = (executionResult?.testResults || []).filter(
            (tr: any) => {
                const originalTest = tests.find((t) => t.id === tr.id);
                return originalTest && !originalTest.isHidden;
            },
        );

        return {
            score,
            penaltiesApplied: penalty,
            tabSwitches,
            copyPasteCount,
            executionTimeMs,
            allPassed,
            testResults: publicResults,
            totalTests,
            passedTests,
            timeTakenSeconds,
            error: executionResult?.error,
        };
    }
}
