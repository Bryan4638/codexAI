import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { GetAllBadgesUseCase } from './use-cases/get-all-badges.use-case';
import { GetUserBadgesUseCase } from './use-cases/get-user-badges.use-case';
import { GetUserProgressUseCase } from './use-cases/get-user-progress.use-case';

@Controller('badges')
export class BadgesController {
  constructor(
    private readonly getAllBadgesUseCase: GetAllBadgesUseCase,
    private readonly getUserBadgesUseCase: GetUserBadgesUseCase,
    private readonly getUserProgressUseCase: GetUserProgressUseCase,
  ) {}

  @Get()
  getAllBadges() {
    return this.getAllBadgesUseCase.execute();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUserBadges(@CurrentUser() user: User) {
    return this.getUserBadgesUseCase.execute(user.id);
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  getUserProgress(@CurrentUser() user: User) {
    return this.getUserProgressUseCase.execute(user.id);
  }
}
