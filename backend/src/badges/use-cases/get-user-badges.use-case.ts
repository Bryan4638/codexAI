import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBadge } from '../../auth/entities/user-badge.entity';
import { badges } from '../data/badges.data';
import { Badge } from '../../common/types';

export interface GetUserBadgesResult {
  badges: (Badge & { unlocked_at: Date })[];
  total: number;
  unlocked: number;
}

@Injectable()
export class GetUserBadgesUseCase {
  constructor(
    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,
  ) {}

  async execute(userId: string): Promise<GetUserBadgesResult> {
    const userBadges = await this.userBadgeRepository.find({
      where: { userId },
      select: ['badgeId', 'unlockedAt'],
    });

    const badgesWithDetails = userBadges.map((ub) => {
      const badge = badges.find((b) => b.id === ub.badgeId);
      return {
        ...badge!,
        unlocked_at: ub.unlockedAt,
      };
    });

    return {
      badges: badgesWithDetails,
      total: badges.length,
      unlocked: userBadges.length,
    };
  }
}
