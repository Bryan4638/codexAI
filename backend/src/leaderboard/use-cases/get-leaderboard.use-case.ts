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

  async execute(
    filters?: {
      page?: number;
      limit?: number;
    },
    userId?: string,
  ): Promise<GetLeaderboardResult> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'xp', 'level', 'isPublic', 'avatarUrl', 'bio'],
      relations: ['badges'],
      order: { level: 'DESC', xp: 'DESC' },
      take: limit,
      skip: skip,
    });

    // Helper to map user entity to LeaderboardEntry
    const mapUserToEntry = (user: User, rank: number): LeaderboardEntry => {
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
        isPublic: user.isPublic,
        avatarUrl: user.avatarUrl,
        bio: user.isPublic ? user.bio : null,
        badgeCount: userBadges.length,
        topBadge: userBadges[0] || null,
      };
    };

    // Calcular ranking con medallas
    const leaderboard: LeaderboardEntry[] = users.map((user, index) =>
      mapUserToEntry(user, skip + index + 1),
    );

    let userEntry: LeaderboardEntry | null = null;

    if (userId && !leaderboard.some((u) => u.id === userId)) {
      // Check if user is already in the fetched page
      const userInPage = leaderboard.find((u) => u.id === userId);
      if (userInPage) {
        userEntry = userInPage;
      } else {
        // If not in page, fetch user details
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
    }

    return {
      leaderboard: userEntry ? [...leaderboard, userEntry] : leaderboard,
      totalUsers,
    };
  }
}
