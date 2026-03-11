import { Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { CreateChallengeUseCase } from './use-cases/create-challenge.use-case';
import { GetChallengesUseCase } from './use-cases/get-challenges.use-case';
import { ToggleReactionUseCase } from './use-cases/toggle-reaction.use-case';
import { DeleteChallengeUseCase } from './use-cases/delete-challenge.use-case';
import { GetChallengesDto } from './dto/get-challenges.dto';
import { GetChallengeUseCase } from './use-cases/get-challenge.use-case';
import { StartLiveCodingUseCase } from './use-cases/start-live-coding.use-case';
import { SubmitLiveCodingUseCase } from './use-cases/submit-live-coding.use-case';
import { GetLiveCodingHistoryUseCase } from './use-cases/get-live-coding-history.use-case';
import { StartLiveCodingDto } from './dto/start-live-coding.dto';
import { SubmitLiveCodingDto } from './dto/submit-live-coding.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly createChallengeUseCase: CreateChallengeUseCase,
    private readonly getChallengesUseCase: GetChallengesUseCase,
    private readonly toggleReactionUseCase: ToggleReactionUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
    private readonly getChallengeUseCase: GetChallengeUseCase,
    private readonly startLiveCodingUseCase: StartLiveCodingUseCase,
    private readonly submitLiveCodingUseCase: SubmitLiveCodingUseCase,
    private readonly getLiveCodingHistoryUseCase: GetLiveCodingHistoryUseCase,
  ) { }

  async getChallenges(filters: GetChallengesDto, userId?: string) {
    return this.getChallengesUseCase.execute({
      ...filters,
      currentUserId: userId,
    });
  }

  async getChallenge(id: string) {
    return this.getChallengeUseCase.execute(id);
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

  async startLiveCoding(userId: string, dto: StartLiveCodingDto) {
    return this.startLiveCodingUseCase.execute(userId, dto);
  }

  async submitLiveCoding(userId: string, dto: SubmitLiveCodingDto) {
    return this.submitLiveCodingUseCase.execute(userId, dto);
  }

  async getLiveCodingHistory(userId: string, page?: number, limit?: number) {
    return this.getLiveCodingHistoryUseCase.execute(userId, page, limit);
  }
}

