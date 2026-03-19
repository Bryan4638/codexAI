import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyActivity } from '../entities/daily-activity.entity';

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  exercisesCompleted: number;
  challengesCompleted: number;
  xpEarned: number;
}

export interface GetHeatmapResult {
  days: HeatmapDay[];
  totalActiveDays: number;
  totalExercises: number;
  totalChallenges: number;
  totalXp: number;
}

@Injectable()
export class GetHeatmapUseCase {
  constructor(
    @InjectRepository(DailyActivity)
    private readonly dailyActivityRepository: Repository<DailyActivity>,
  ) {}

  async execute(userId: string, days = 365): Promise<GetHeatmapResult> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    const activities = await this.dailyActivityRepository
      .createQueryBuilder('da')
      .where('da.user_id = :userId', { userId })
      .andWhere('da.activity_date >= :startDate', { startDate: startDateStr })
      .orderBy('da.activity_date', 'ASC')
      .getMany();

    // Build a map of date -> activity
    const activityMap = new Map<string, DailyActivity>();
    activities.forEach((a) => {
      activityMap.set(a.activityDate, a);
    });

    // Find max count for level calculation
    const counts = activities.map(
      (a) => a.exercisesCompleted + a.challengesCompleted,
    );
    const maxCount = counts.length > 0 ? Math.max(...counts) : 1;

    // Generate all days in range
    const heatmapDays: HeatmapDay[] = [];
    const cursor = new Date(startDate);
    const today = new Date();

    while (cursor <= today) {
      const dateStr = cursor.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr);
      const count = activity
        ? activity.exercisesCompleted + activity.challengesCompleted
        : 0;

      // Calculate level (0-4) based on relative activity
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (count > 0 && maxCount > 0) {
        const ratio = count / maxCount;
        if (ratio >= 0.75) level = 4;
        else if (ratio >= 0.5) level = 3;
        else if (ratio >= 0.25) level = 2;
        else level = 1;
      }

      heatmapDays.push({
        date: dateStr,
        count,
        level,
        exercisesCompleted: activity?.exercisesCompleted ?? 0,
        challengesCompleted: activity?.challengesCompleted ?? 0,
        xpEarned: activity?.xpEarned ?? 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    // Aggregate stats
    const totalActiveDays = activities.length;
    const totalExercises = activities.reduce(
      (sum, a) => sum + a.exercisesCompleted,
      0,
    );
    const totalChallenges = activities.reduce(
      (sum, a) => sum + a.challengesCompleted,
      0,
    );
    const totalXp = activities.reduce((sum, a) => sum + a.xpEarned, 0);

    return {
      days: heatmapDays,
      totalActiveDays,
      totalExercises,
      totalChallenges,
      totalXp,
    };
  }
}
