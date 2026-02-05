import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { User } from '../auth/entities/user.entity';
import { UserBadge } from '../auth/entities/user-badge.entity';
import { UserProgress } from '../auth/entities/user-progress.entity';
import { GetLeaderboardUseCase } from './use-cases/get-leaderboard.use-case';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserBadge, UserProgress]),
    AuthModule,
  ],
  controllers: [LeaderboardController],
  providers: [
    GetLeaderboardUseCase,
    GetUserProfileUseCase,
    UpdateProfileUseCase,
  ],
})
export class LeaderboardModule {}
