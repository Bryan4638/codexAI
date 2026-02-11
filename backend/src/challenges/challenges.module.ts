import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { Challenge } from './entities/challenge.entity';
import { Reaction } from './entities/reaction.entity';
import { CreateChallengeUseCase } from './use-cases/create-challenge.use-case';
import { GetChallengesUseCase } from './use-cases/get-challenges.use-case';
import { ToggleReactionUseCase } from './use-cases/toggle-reaction.use-case';
import { DeleteChallengeUseCase } from './use-cases/delete-challenge.use-case';
import { AuthModule } from '../auth/auth.module';

const useCases = [
  CreateChallengeUseCase,
  GetChallengesUseCase,
  ToggleReactionUseCase,
  DeleteChallengeUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Reaction]), AuthModule],
  controllers: [ChallengesController],
  providers: [ChallengesService, ...useCases],
})
export class ChallengesModule {}
