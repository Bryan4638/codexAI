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
import { UpdateStreakUseCase } from '../../streaks/use-cases/update-streak.use-case';
import { RecordActivityUseCase } from '../../analytics/use-cases/record-activity.use-case';
import { RecordWeeklyXpUseCase } from '../../leaderboard/use-cases/record-weekly-xp.use-case';

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
        private readonly updateStreakUseCase: UpdateStreakUseCase,
        private readonly recordActivityUseCase: RecordActivityUseCase,
        private readonly recordWeeklyXpUseCase: RecordWeeklyXpUseCase,
    ) { }

    async execute(userId: string, dto: SubmitLiveCodingDto) {
        const { sessionId, code, language, tabSwitches, copyPasteCount } = dto;

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

        // Compute real elapsed time from server avoiding TZ mismatch
        const [{ elapsed }] = await this.sessionRepo.query(
            'SELECT EXTRACT(EPOCH FROM (NOW() - started_at)) as elapsed FROM live_coding_sessions WHERE id = $1',
            [session.id]
        );
        const timeTakenSeconds = Math.max(0, Math.floor(elapsed));

        // Use maximum penalty between DB and what they sent to avoid reversing penalties
        const finalTabSwitches = Math.max(session.tabSwitches, tabSwitches || 0);
        const finalCopyPasteCount = Math.max(session.copyPasteCount, copyPasteCount || 0);

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
        const timeBonusFactor = Math.max(0, 1 - timeTakenSeconds / MAX_TIME_SECONDS);
        const timeBonus = baseDifficulty * 0.5 * timeBonusFactor;
        const testMultiplier = totalTests > 0 ? passedTests / totalTests : 0;
        const penalty =
            finalTabSwitches * TAB_SWITCH_PENALTY + finalCopyPasteCount * COPY_PASTE_PENALTY;

        const score = Math.max(
            0,
            Math.round((baseDifficulty + timeBonus) * testMultiplier - penalty),
        );

        // Update session
        session.code = code;
        session.timeTakenSeconds = timeTakenSeconds;
        session.executionTimeMs = executionTimeMs;
        session.score = score;
        session.tabSwitches = finalTabSwitches;
        session.copyPasteCount = finalCopyPasteCount;
        session.penaltiesApplied = penalty;
        session.allTestsPassed = allPassed;
        session.completedAt = new Date();

        await this.sessionRepo.save(session);

        // Update streak on successful completion
        if (allPassed) {
            await this.updateStreakUseCase.execute(userId);
        }

        // Record daily activity
        await this.recordActivityUseCase.execute({
            userId,
            challengesCompleted: allPassed ? 1 : 0,
            xpEarned: score,
            timeSpentMinutes: Math.ceil(timeTakenSeconds / 60),
        });

        // Record weekly XP for leaderboards
        if (score > 0) {
            await this.recordWeeklyXpUseCase.execute(userId, score);
        }

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
            tabSwitches: finalTabSwitches,
            copyPasteCount: finalCopyPasteCount,
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
