import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStreak } from './entities/user-streak.entity';
import { StreaksController } from './streaks.controller';
import { UpdateStreakUseCase } from './use-cases/update-streak.use-case';
import { GetStreakUseCase } from './use-cases/get-streak.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserStreak]), AuthModule],
  controllers: [StreaksController],
  providers: [UpdateStreakUseCase, GetStreakUseCase],
  exports: [UpdateStreakUseCase],
})
export class StreaksModule {}
