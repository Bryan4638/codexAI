import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class GetChallengesUseCase {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async execute(filters?: {
    difficulty?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (filters?.difficulty && filters.difficulty !== 'all') {
      where.difficulty = filters.difficulty;
    }

    const [challenges, total] = await this.challengeRepository.findAndCount({
      where,
      relations: ['author', 'reactions'],
      select: {
        author: {
          username: true,
          avatarUrl: true,
        },
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: skip,
    });

    // Transformar para añadir conteo de reacciones
    const data = challenges.map((challenge) => ({
      ...challenge,
      _count: {
        reactions: challenge.reactions?.length || 0,
      },
      reactions: challenge.reactions?.map((r) => ({ userId: r.userId })) || [],
    }));

    // Si ordenar por popularidad
    if (filters?.sort === 'popularity') {
      data.sort((a, b) => b._count.reactions - a._count.reactions);
    }

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }
}
