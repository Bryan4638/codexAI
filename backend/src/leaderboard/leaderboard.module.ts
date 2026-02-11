import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { User } from '../auth/entities/user.entity';
import { UserBadge } from '../auth/entities/user-badge.entity';
import { UserProgress } from '../auth/entities/user-progress.entity';
import { GetLeaderboardUseCase } from './use-cases/get-leaderboard.use-case';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';
import { AuthModule } from '../auth/auth.module';

const useCases = [
  GetLeaderboardUseCase,
  GetUserProfileUseCase,
  UpdateProfileUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserBadge, UserProgress]),
    AuthModule,
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, ...useCases],
})
export class LeaderboardModule {}
