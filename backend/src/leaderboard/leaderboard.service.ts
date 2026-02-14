import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetLeaderboardUseCase } from './use-cases/get-leaderboard.use-case';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';

@Injectable()
export class LeaderboardService {
  constructor(
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  async getLeaderboard(query?: any, userId?: string) {
    return this.getLeaderboardUseCase.execute(query, userId);
  }

  async getUserProfile(userId: string) {
    return this.getUserProfileUseCase.execute(userId);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(userId, dto);
  }
}
