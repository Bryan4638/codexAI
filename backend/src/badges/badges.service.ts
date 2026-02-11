import { Injectable } from '@nestjs/common';
import { GetAllBadgesUseCase } from './use-cases/get-all-badges.use-case';
import { GetUserBadgesUseCase } from './use-cases/get-user-badges.use-case';
import { GetUserProgressUseCase } from './use-cases/get-user-progress.use-case';

@Injectable()
export class BadgesService {
  constructor(
    private readonly getAllBadgesUseCase: GetAllBadgesUseCase,
    private readonly getUserBadgesUseCase: GetUserBadgesUseCase,
    private readonly getUserProgressUseCase: GetUserProgressUseCase,
  ) {}

  async getAllBadges() {
    return this.getAllBadgesUseCase.execute();
  }

  async getUserBadges(userId: string) {
    return this.getUserBadgesUseCase.execute(userId);
  }

  async getUserProgress(userId: string) {
    return this.getUserProgressUseCase.execute(userId);
  }
}
