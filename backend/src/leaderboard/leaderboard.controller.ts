import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetLeaderboardUseCase } from './use-cases/get-leaderboard.use-case';
import { GetUserProfileUseCase } from './use-cases/get-user-profile.use-case';
import { UpdateProfileUseCase } from './use-cases/update-profile.use-case';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
  ) {}

  @Get()
  getLeaderboard() {
    return this.getLeaderboardUseCase.execute();
  }

  @Get('profile/:userId')
  getUserProfile(@Param('userId') userId: string) {
    return this.getUserProfileUseCase.execute(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(user.id, dto);
  }
}
