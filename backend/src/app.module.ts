import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ExecutionModule } from './execution/execution.module';
import { HealthModule } from './health/health.module';

// Entities
import { User } from './auth/entities/user.entity';
import { UserProgress } from './auth/entities/user-progress.entity';
import { UserBadge } from './auth/entities/user-badge.entity';
import { Challenge } from './challenges/entities/challenge.entity';
import { Reaction } from './challenges/entities/reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '4638',
      database: process.env.DB_NAME || 'codex',
      entities: [User, UserProgress, UserBadge, Challenge, Reaction],
      synchronize: false, // Use migrations instead
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    BadgesModule,
    ExercisesModule,
    LeaderboardModule,
    ChallengesModule,
    ExecutionModule,
    HealthModule,
  ],
})
export class AppModule {}
