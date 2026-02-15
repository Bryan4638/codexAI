import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { CreateChallengeUseCase } from './use-cases/create-challenge.use-case';
import { GetChallengesUseCase } from './use-cases/get-challenges.use-case';
import { ToggleReactionUseCase } from './use-cases/toggle-reaction.use-case';
import { DeleteChallengeUseCase } from './use-cases/delete-challenge.use-case';
import { GetChallengesDto } from './dto/get-challenges.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly getChallengesUseCase: GetChallengesUseCase,
    private readonly toggleReactionUseCase: ToggleReactionUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
  ) {}

  async getChallenges(filters: GetChallengesDto, userId?: string) {
    return this.getChallengesUseCase.execute({
      ...filters,
      currentUserId: userId,
    });
  }

  async createChallenge(userId: string, dto: CreateChallengeDto) {
    return this.createChallengeUseCase.execute(userId, dto);
  }

  async toggleReaction(userId: string, challengeId: string) {
    return this.toggleReactionUseCase.execute(userId, challengeId);
  }

  async deleteChallenge(userId: string, challengeId: string) {
    return this.deleteChallengeUseCase.execute(userId, challengeId);
  }
}
