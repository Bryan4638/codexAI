import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStreak } from '../entities/user-streak.entity';

export interface GetStreakResult {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  streakStartDate: string | null;
  isActiveToday: boolean;
}

@Injectable()
export class GetStreakUseCase {
  constructor(
    @InjectRepository(UserStreak)
    private readonly streakRepository: Repository<UserStreak>,
  ) {}

  async execute(userId: string): Promise<GetStreakResult> {
    const streak = await this.streakRepository.findOne({
      where: { userId },
    });

    if (!streak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        streakStartDate: null,
        isActiveToday: false,
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const isActiveToday = streak.lastActivityDate === today;

    // If the streak is broken (last activity was more than 1 day ago and not today),
    // report currentStreak as 0
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const isStillActive =
      isActiveToday || streak.lastActivityDate === yesterdayStr;

    return {
      currentStreak: isStillActive ? streak.currentStreak : 0,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      streakStartDate: streak.streakStartDate,
      isActiveToday,
    };
  }
}
