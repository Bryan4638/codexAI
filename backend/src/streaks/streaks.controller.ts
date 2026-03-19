import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetStreakUseCase } from './use-cases/get-streak.use-case';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('streaks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class StreaksController {
  constructor(private readonly getStreakUseCase: GetStreakUseCase) { }

  @Get()
  async getStreak(@Req() req: any) {
    return this.getStreakUseCase.execute(req.user.id);
  }
}
