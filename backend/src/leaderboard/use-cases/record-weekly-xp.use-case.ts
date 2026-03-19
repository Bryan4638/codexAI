import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyXp } from '../entities/weekly-xp.entity';

@Injectable()
export class RecordWeeklyXpUseCase {
  constructor(
    @InjectRepository(WeeklyXp)
    private readonly weeklyXpRepository: Repository<WeeklyXp>,
  ) {}

  /**
   * Get the Monday of the current week in YYYY-MM-DD format
   */
  private getCurrentWeekStart(): string {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon, ...
    const diff = day === 0 ? 6 : day - 1; // Adjust so Monday = 0
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    return monday.toISOString().split('T')[0];
  }

  async execute(userId: string, xpEarned: number): Promise<void> {
    const weekStart = this.getCurrentWeekStart();

    const existing = await this.weeklyXpRepository.findOne({
      where: { userId, weekStart },
    });

    if (existing) {
      existing.xpEarned += xpEarned;
      await this.weeklyXpRepository.save(existing);
    } else {
      const record = this.weeklyXpRepository.create({
        userId,
        xpEarned,
        weekStart,
      });
      await this.weeklyXpRepository.save(record);
    }
  }
}
