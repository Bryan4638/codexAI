import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { badges } from '../../badges/data/badges.data';

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  xp: number;
  level: number;
  isPublic: boolean;
  avatarUrl: string | null;
  bio: string | null;
  badgeCount: number;
  topBadge: { icon: string; name: string } | null;
}

export interface GetLeaderboardResult {
  leaderboard: LeaderboardEntry[];
  totalUsers: number;
}

@Injectable()
export class GetLeaderboardUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(): Promise<GetLeaderboardResult> {
    const users = await this.userRepository.find({
      select: ['id', 'username', 'xp', 'level', 'isPublic', 'avatarUrl', 'bio'],
      relations: ['badges'],
      order: { level: 'DESC', xp: 'DESC' },
    });

    // Calcular ranking con medallas
    const leaderboard: LeaderboardEntry[] = users.map((user, index) => {
      const userBadges = user.badges
        .map((ub) => {
          const badge = badges.find((b) => b.id === ub.badgeId);
          return badge ? { icon: badge.icon, name: badge.name } : null;
        })
        .filter((b): b is { icon: string; name: string } => b !== null);

      return {
        rank: index + 1,
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        isPublic: user.isPublic,
        avatarUrl: user.avatarUrl,
        bio: user.isPublic ? user.bio : null,
        badgeCount: userBadges.length,
        topBadge: userBadges[0] || null,
      };
    });

    // Ordenar por cantidad de medallas primero, luego por XP
    leaderboard.sort((a, b) => {
      if (b.badgeCount !== a.badgeCount) return b.badgeCount - a.badgeCount;
      return b.xp - a.xp;
    });

    // Reasignar ranks después de ordenar
    leaderboard.forEach((user, index) => {
      user.rank = index + 1;
    });

    return {
      leaderboard,
      totalUsers: leaderboard.length,
    };
  }
}
