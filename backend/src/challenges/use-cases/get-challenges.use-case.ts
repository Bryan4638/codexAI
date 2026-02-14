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
    currentUserId?: string;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.challengeRepository
      .createQueryBuilder('challenge')
      .leftJoin('challenge.author', 'author')
      .leftJoin('challenge.reactions', 'reaction')
      .select([
        'challenge.id',
        'challenge.title',
        'challenge.description',
        'challenge.initialCode',
        'challenge.difficulty',
        'challenge.createdAt',
        'challenge.testCases',
        'author.username',
        'author.avatarUrl',
      ])
      .addSelect('COUNT(reaction.id)', 'reactionsCount')
      .groupBy('challenge.id')
      .addGroupBy('author.id')
      .take(limit)
      .skip(skip)
      .orderBy('challenge.createdAt', 'DESC');

    if (filters?.difficulty && filters.difficulty !== 'all') {
      qb.andWhere('challenge.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    if (filters?.sort === 'popularity') {
      qb.orderBy('reactionsCount', 'DESC');
    }

    if (filters?.currentUserId) {
      qb.addSelect(
        `SUM(CASE WHEN reaction.userId = :userId THEN 1 ELSE 0 END)`,
        'hasReacted',
      ).setParameter('userId', filters.currentUserId);
    }

    const raw = await qb.getRawMany();
    const total = await qb.getCount();

    const data = raw.map((row) => ({
      id: row.challenge_id,
      title: row.challenge_title,
      description: row.challenge_description,
      initialCode: row.challenge_initial_code,
      testCases: row.challenge_test_cases,
      difficulty: row.challenge_difficulty,
      createdAt: row.challenge_created_at,
      author: {
        username: row.author_username,
        avatarUrl: row.author_avatar_url,
      },
      reactionsCount: Number(row.reactionsCount),
      hasReacted: Boolean(Number(row.hasReacted || 0)),
    }));

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
