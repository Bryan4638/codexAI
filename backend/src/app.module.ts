import { Module as NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BadgesModule } from './badges/badges.module';
import { ExercisesModule } from './exercises/exercises.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ExecutionModule } from './execution/execution.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';

import { env } from './config/env';

// Entities
import { User } from './auth/entities/user.entity';
import { UserProgress } from './auth/entities/user-progress.entity';
import { UserBadge } from './auth/entities/user-badge.entity';
import { RefreshToken } from './auth/entities/refresh-token.entity';
import { EmailCode } from './auth/entities/email-code.entity';
import { Challenge } from './challenges/entities/challenge.entity';
import { Reaction } from './challenges/entities/reaction.entity';
import { Module } from './exercises/entities/module.entity';
import { Lesson } from './exercises/entities/lesson.entity';
import { Exercise } from './exercises/entities/exercise.entity';

@NestModule({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: env.DATABASE_URL,
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: [
        User,
        UserProgress,
        UserBadge,
        RefreshToken,
        EmailCode,
        Challenge,
        Reaction,
        Module,
        Lesson,
        Exercise,
      ],
      synchronize: false, // Use migrations instead
      //logging: env.NODE_ENV !== 'production',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    BadgesModule,
    ExercisesModule,
    LeaderboardModule,
    ChallengesModule,
    ExecutionModule,
    HealthModule,
    DashboardModule,
  ],
})
export class AppModule {}
