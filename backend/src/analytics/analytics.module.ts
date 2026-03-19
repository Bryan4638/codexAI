import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyActivity } from './entities/daily-activity.entity';
import { AnalyticsController } from './analytics.controller';
import { RecordActivityUseCase } from './use-cases/record-activity.use-case';
import { GetHeatmapUseCase } from './use-cases/get-heatmap.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DailyActivity]), AuthModule],
  controllers: [AnalyticsController],
  providers: [RecordActivityUseCase, GetHeatmapUseCase],
  exports: [RecordActivityUseCase],
})
export class AnalyticsModule {}
