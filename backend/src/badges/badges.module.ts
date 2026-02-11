import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgesController } from './badges.controller';
import { BadgesService } from './badges.service';
import { UserBadge } from '../auth/entities/user-badge.entity';
import { User } from '../auth/entities/user.entity';
import { UserProgress } from '../auth/entities/user-progress.entity';
import { GetAllBadgesUseCase } from './use-cases/get-all-badges.use-case';
import { GetUserBadgesUseCase } from './use-cases/get-user-badges.use-case';
import { GetUserProgressUseCase } from './use-cases/get-user-progress.use-case';
import { AuthModule } from '../auth/auth.module';

const useCases = [
  GetAllBadgesUseCase,
  GetUserBadgesUseCase,
  GetUserProgressUseCase,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserBadge, UserProgress]),
    AuthModule,
  ],
  controllers: [BadgesController],
  providers: [BadgesService, ...useCases],
  exports: [GetUserProgressUseCase],
})
export class BadgesModule {}
