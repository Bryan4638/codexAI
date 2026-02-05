import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesController } from './exercises.controller';
import { User } from '../auth/entities/user.entity';
import { UserProgress } from '../auth/entities/user-progress.entity';
import { UserBadge } from '../auth/entities/user-badge.entity';
import { GetAllExercisesUseCase } from './use-cases/get-all-exercises.use-case';
import { GetExerciseByIdUseCase } from './use-cases/get-exercise-by-id.use-case';
import { ValidateExerciseUseCase } from './use-cases/validate-exercise.use-case';
import { CheckAndUnlockBadgesUseCase } from './use-cases/check-and-unlock-badges.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProgress, UserBadge]),
    AuthModule,
  ],
  controllers: [ExercisesController],
  providers: [
    GetAllExercisesUseCase,
    GetExerciseByIdUseCase,
    ValidateExerciseUseCase,
    CheckAndUnlockBadgesUseCase,
  ],
  exports: [CheckAndUnlockBadgesUseCase],
})
export class ExercisesModule {}
