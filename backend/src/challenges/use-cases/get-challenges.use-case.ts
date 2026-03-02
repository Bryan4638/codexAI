import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrder } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';

interface GetChallengesUseCaseProps {
  difficulty?: string;
  sort?: string;
  page?: number;
  limit?: number;
  completed?: string;
  currentUserId?: string;
}

@Injectable()
export class GetChallengesUseCase {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async execute(filters?: GetChallengesUseCaseProps) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    const qb = this.challengeRepository
      .createQueryBuilder('challenge')
      .leftJoin('challenge.author', 'author')
      .leftJoin('challenge.reactions', 'reaction');

    if (filters?.currentUserId) {
      qb.leftJoin(
        'challenge.userProgress',
        'progress',
        'progress.user_id = :userId',
        { userId: filters.currentUserId },
      );
    }

    qb.select([
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
      .limit(limit)
      .offset(skip)
      .orderBy('challenge.createdAt', 'DESC');

    if (filters?.currentUserId) {
      qb.addGroupBy('progress.id');
    }

    if (filters?.difficulty && filters.difficulty !== 'all') {
      qb.andWhere('challenge.difficulty = :difficulty', {
        difficulty: filters.difficulty,
      });
    }

    if (
      filters?.currentUserId &&
      filters?.completed &&
      filters.completed !== 'all'
    ) {
      if (filters.completed === 'completed') {
        qb.andWhere('progress.id IS NOT NULL');
      } else if (filters.completed === 'pending') {
        qb.andWhere('progress.id IS NULL');
      }
    }

    if (filters?.sort === 'popularity') {
      qb.orderBy('"reactionsCount"', 'DESC');
    }

    if (filters?.currentUserId) {
      qb.addSelect(
        `SUM(CASE WHEN reaction.userId = :userId THEN 1 ELSE 0 END)`,
        'hasReacted',
      );
      qb.addSelect(
        'CASE WHEN progress.id IS NOT NULL THEN 1 ELSE 0 END',
        'hasCompleted',
      );
      qb.addSelect('progress.best_execution_code', 'bestExecutionCode');
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
      hasCompleted: Boolean(Number(row.hasCompleted || 0)),
      bestExecutionCode: row.bestExecutionCode || null,
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
