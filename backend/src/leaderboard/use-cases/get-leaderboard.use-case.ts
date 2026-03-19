import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { WeeklyXp } from '../entities/weekly-xp.entity';
import { badges } from '../../badges/data/badges.data';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  xp: number;
  level: number;
  league: string;
  isPublic: boolean;
  avatarUrl: string | null;
  bio: string | null;
  badgeCount: number;
  topBadge: { icon: string; name: string } | null;
  periodXp?: number;
}

export interface GetLeaderboardResult {
  leaderboard: LeaderboardEntry[];
  totalUsers: number;
  period: string;
}

@Injectable()
export class GetLeaderboardUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WeeklyXp)
    private readonly weeklyXpRepository: Repository<WeeklyXp>,
  ) {}

  private getCurrentWeekStart(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    return monday.toISOString().split('T')[0];
  }

  private getMonthStart(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }

  async execute(
    filters?: {
      page?: number;
      limit?: number;
      period?: 'weekly' | 'monthly' | 'all-time';
    },
    userId?: string,
  ): Promise<GetLeaderboardResult> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;
    const period = filters?.period || 'all-time';

    // Helper to map user entity to LeaderboardEntry
    const mapUserToEntry = (
      user: User,
      rank: number,
      periodXp?: number,
    ): LeaderboardEntry => {
      const userBadges = user.badges
        .map((ub) => {
          const badge = badges.find((b) => b.id === ub.badgeId);
          return badge ? { icon: badge.icon, name: badge.name } : null;
        })
        .filter((b): b is { icon: string; name: string } => b !== null);

      return {
        rank,
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        league: user.league || 'bronze',
        isPublic: user.isPublic,
        avatarUrl: user.avatarUrl,
        bio: user.isPublic ? user.bio : null,
        badgeCount: userBadges.length,
        topBadge: userBadges[0] || null,
        periodXp,
      };
    };

    // ── All-time leaderboard ──
    if (period === 'all-time') {
      const [users, totalUsers] = await this.userRepository.findAndCount({
        select: ['id', 'username', 'xp', 'level', 'isPublic', 'avatarUrl', 'bio', 'league'],
        relations: ['badges'],
        order: { level: 'DESC', xp: 'DESC' },
        take: limit,
        skip: skip,
      });

      const leaderboard = users.map((user, index) =>
        mapUserToEntry(user, skip + index + 1),
      );

      return this.appendCurrentUser(leaderboard, totalUsers, userId, mapUserToEntry, period);
    }

    // ── Period-based leaderboard (weekly / monthly) ──
    const startDate =
      period === 'weekly' ? this.getCurrentWeekStart() : this.getMonthStart();

    // Get aggregated XP for the period
    const periodData = await this.weeklyXpRepository
      .createQueryBuilder('wxp')
      .select('wxp.user_id', 'userId')
      .addSelect('SUM(wxp.xp_earned)', 'totalXp')
      .where('wxp.week_start >= :startDate', { startDate })
      .groupBy('wxp.user_id')
      .orderBy('"totalXp"', 'DESC')
      .offset(skip)
      .limit(limit)
      .getRawMany();

    const totalUsers = await this.weeklyXpRepository
      .createQueryBuilder('wxp')
      .select('COUNT(DISTINCT wxp.user_id)', 'count')
      .where('wxp.week_start >= :startDate', { startDate })
      .getRawOne();

    // Fetch user details for the ranked users
    const userIds = periodData.map((d) => d.userId);
    let users: User[] = [];
    if (userIds.length > 0) {
      users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.badges', 'badges')
        .where('user.id IN (:...ids)', { ids: userIds })
        .getMany();
    }

    const userMap = new Map(users.map((u) => [u.id, u]));
    const leaderboard: LeaderboardEntry[] = periodData
      .map((d, index) => {
        const user = userMap.get(d.userId);
        if (!user) return null;
        return mapUserToEntry(user, skip + index + 1, parseInt(d.totalXp));
      })
      .filter((e): e is LeaderboardEntry => e !== null);

    return {
      leaderboard,
      totalUsers: parseInt(totalUsers?.count ?? '0'),
      period,
    };
  }

  private async appendCurrentUser(
    leaderboard: LeaderboardEntry[],
    totalUsers: number,
    userId: string | undefined,
    mapUserToEntry: (user: User, rank: number, periodXp?: number) => LeaderboardEntry,
    period: string,
  ): Promise<GetLeaderboardResult> {
    let userEntry: LeaderboardEntry | null = null;

    if (userId && !leaderboard.some((u) => u.id === userId)) {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['badges'],
      });

      if (user) {
        const count = await this.userRepository
          .createQueryBuilder('user')
          .where('user.level > :level', { level: user.level })
          .orWhere('user.level = :level AND user.xp > :xp', {
            level: user.level,
            xp: user.xp,
          })
          .getCount();

        userEntry = mapUserToEntry(user, count + 1);
      }
    }

    return {
      leaderboard: userEntry ? [...leaderboard, userEntry] : leaderboard,
      totalUsers,
      period,
    };
  }
}
