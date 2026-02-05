import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export interface UpdateProfileResult {
  user: {
    id: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    isPublic: boolean;
    bio: string | null;
    github: string | null;
    linkedin: string | null;
    twitter: string | null;
    website: string | null;
    avatarUrl: string | null;
  };
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UpdateProfileResult> {
    const updateData: Record<string, unknown> = {};

    if (dto.bio !== undefined) updateData.bio = dto.bio;
    if (dto.github !== undefined) updateData.github = dto.github;
    if (dto.linkedin !== undefined) updateData.linkedin = dto.linkedin;
    if (dto.twitter !== undefined) updateData.twitter = dto.twitter;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    if (dto.isPublic !== undefined) updateData.isPublic = dto.isPublic;

    await this.userRepository.update({ id: userId }, updateData);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'id',
        'username',
        'email',
        'xp',
        'level',
        'isPublic',
        'bio',
        'github',
        'linkedin',
        'twitter',
        'website',
        'avatarUrl',
      ],
    });

    return { user: updatedUser! };
  }
}
