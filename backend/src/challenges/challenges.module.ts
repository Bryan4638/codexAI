import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { Challenge } from './entities/challenge.entity';
import { Reaction } from './entities/reaction.entity';
import { LiveCodingSession } from './entities/live-coding-session.entity';
import { ChallengeTest } from './entities/challenge-test.entity';
import { CreateChallengeUseCase } from './use-cases/create-challenge.use-case';
import { GetChallengesUseCase } from './use-cases/get-challenges.use-case';
import { ToggleReactionUseCase } from './use-cases/toggle-reaction.use-case';
import { DeleteChallengeUseCase } from './use-cases/delete-challenge.use-case';
import { GetChallengeUseCase } from './use-cases/get-challenge.use-case';
import { StartLiveCodingUseCase } from './use-cases/start-live-coding.use-case';
import { SubmitLiveCodingUseCase } from './use-cases/submit-live-coding.use-case';
import { GetLiveCodingHistoryUseCase } from './use-cases/get-live-coding-history.use-case';
import { CancelLiveCodingUseCase } from './use-cases/cancel-live-coding.use-case';
import { SyncLiveCodingUseCase } from './use-cases/sync-live-coding.use-case';
import { AuthModule } from '../auth/auth.module';
import { ExecutionModule } from '../execution/execution.module';
import { StreaksModule } from '../streaks/streaks.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';

const useCases = [
  CreateChallengeUseCase,
  GetChallengesUseCase,
  ToggleReactionUseCase,
  DeleteChallengeUseCase,
  GetChallengeUseCase,
  StartLiveCodingUseCase,
  SubmitLiveCodingUseCase,
  GetLiveCodingHistoryUseCase,
  CancelLiveCodingUseCase,
  SyncLiveCodingUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([Challenge, Reaction, LiveCodingSession, ChallengeTest]),
    AuthModule,
    ExecutionModule,
    StreaksModule,
    AnalyticsModule,
    LeaderboardModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, ...useCases],
})
export class ChallengesModule { }

