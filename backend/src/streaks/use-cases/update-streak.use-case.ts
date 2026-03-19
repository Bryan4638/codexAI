import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStreak } from '../entities/user-streak.entity';

@Injectable()
export class UpdateStreakUseCase {
  constructor(
    @InjectRepository(UserStreak)
    private readonly streakRepository: Repository<UserStreak>,
  ) {}

  async execute(userId: string): Promise<UserStreak> {
    // Get or create streak record
    let streak = await this.streakRepository.findOne({
      where: { userId },
    });

    if (!streak) {
      streak = this.streakRepository.create({
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        streakStartDate: null,
      });
    }

    // Get today's date in YYYY-MM-DD format (server timezone)
    const today = new Date().toISOString().split('T')[0];

    // If already registered activity today, no-op
    if (streak.lastActivityDate === today) {
      return streak;
    }

    // Calculate yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastActivityDate === yesterdayStr) {
      // Consecutive day: increment streak
      streak.currentStreak += 1;
    } else {
      // Streak broken or first activity: reset to 1
      streak.currentStreak = 1;
      streak.streakStartDate = today;
    }

    // Update longest streak if current exceeds it
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastActivityDate = today;

    return this.streakRepository.save(streak);
  }
}
