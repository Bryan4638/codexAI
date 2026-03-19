import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyActivity } from '../entities/daily-activity.entity';

export interface RecordActivityParams {
  userId: string;
  exercisesCompleted?: number;
  challengesCompleted?: number;
  xpEarned?: number;
  timeSpentMinutes?: number;
}

@Injectable()
export class RecordActivityUseCase {
  constructor(
    @InjectRepository(DailyActivity)
    private readonly dailyActivityRepository: Repository<DailyActivity>,
  ) {}

  async execute(params: RecordActivityParams): Promise<void> {
    const today = new Date().toISOString().split('T')[0];

    // Try to find existing record for today
    let activity = await this.dailyActivityRepository.findOne({
      where: { userId: params.userId, activityDate: today },
    });

    if (activity) {
      // Increment existing counters
      if (params.exercisesCompleted) {
        activity.exercisesCompleted += params.exercisesCompleted;
      }
      if (params.challengesCompleted) {
        activity.challengesCompleted += params.challengesCompleted;
      }
      if (params.xpEarned) {
        activity.xpEarned += params.xpEarned;
      }
      if (params.timeSpentMinutes) {
        activity.timeSpentMinutes += params.timeSpentMinutes;
      }
    } else {
      // Create new record for today
      activity = this.dailyActivityRepository.create({
        userId: params.userId,
        activityDate: today,
        exercisesCompleted: params.exercisesCompleted ?? 0,
        challengesCompleted: params.challengesCompleted ?? 0,
        xpEarned: params.xpEarned ?? 0,
        timeSpentMinutes: params.timeSpentMinutes ?? 0,
      });
    }

    await this.dailyActivityRepository.save(activity);
  }
}
