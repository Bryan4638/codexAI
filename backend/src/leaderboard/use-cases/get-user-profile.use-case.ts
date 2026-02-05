import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { badges } from '../../badges/data/badges.data';

export interface GetUserProfileResult {
  profile: {
    id: string;
    username: string;
    xp?: number;
    level: number;
    isPublic: boolean;
    bio?: string | null;
    contact?: {
      github: string | null;
      linkedin: string | null;
      twitter: string | null;
      website: string | null;
    };
    avatarUrl?: string | null;
    memberSince?: Date;
    exercisesCompleted?: number;
    badges?: unknown[];
    badgeCount: number;
    topBadge?: { icon: string; name: string } | null;
  };
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(userId: string): Promise<GetUserProfileResult> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'username',
        'xp',
        'level',
        'isPublic',
        'bio',
        'github',
        'linkedin',
        'twitter',
        'website',
        'avatarUrl',
        'createdAt',
      ],
      relations: ['badges', 'progress'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const userBadges = user.badges
      .map((ub) => {
        const badge = badges.find((b) => b.id === ub.badgeId);
        return badge ? { ...badge, unlockedAt: ub.unlockedAt } : null;
      })
      .filter((b) => b !== null);

    // Si el perfil es privado, solo mostrar info básica
    if (!user.isPublic) {
      return {
        profile: {
          id: user.id,
          username: user.username,
          level: user.level,
          isPublic: false,
          badgeCount: userBadges.length,
          topBadge: userBadges[0]
            ? { icon: userBadges[0].icon, name: userBadges[0].name }
            : null,
        },
      };
    }

    // Perfil público completo
    return {
      profile: {
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        isPublic: true,
        bio: user.bio,
        contact: {
          github: user.github,
          linkedin: user.linkedin,
          twitter: user.twitter,
          website: user.website,
        },
        avatarUrl: user.avatarUrl,
        memberSince: user.createdAt,
        exercisesCompleted: user.progress?.length || 0,
        badges: userBadges,
        badgeCount: userBadges.length,
      },
    };
  }
}
