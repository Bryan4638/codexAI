import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetHeatmapUseCase } from './use-cases/get-heatmap.use-case';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class AnalyticsController {
  constructor(private readonly getHeatmapUseCase: GetHeatmapUseCase) { }

  @Get('heatmap')
  async getHeatmap(@Req() req: any) {
    return this.getHeatmapUseCase.execute(req.user.id);
  }
}
