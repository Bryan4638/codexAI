import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../../entities/module.entity';

@Injectable()
export class GetAllModulesUseCase {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async execute(userId?: string): Promise<Module[]> {
    const qb = this.moduleRepository
      .createQueryBuilder('m')
      .leftJoin('m.lessons', 'l')
      .leftJoin('l.exercises', 'e');

    if (userId) {
      qb.leftJoin(
        'user_progress',
        'up',
        `
        up.exercise_id = e.id
        AND up.user_id = :userId
        AND up.completed_at IS NOT NULL
        `,
        { userId },
      );
    }

    qb.select([
      'm.id AS id',
      'm.moduleNumber AS "moduleNumber"',
      'm.name AS "name"',
      'm.description AS "description"',
      'm.icon AS "icon"',
      'm.order AS "order"',
      'm.isActive AS "isActive"',
      'm.createdAt AS "createdAt"',
      'm.updatedAt AS "updatedAt"',
      'COUNT(DISTINCT e.id) AS "totalExercises"',
      userId
        ? 'COUNT(DISTINCT up.exercise_id) AS "completedExercises"'
        : '0 AS "completedExercises"',
    ])
      .where('m.isActive = true')
      .groupBy('m.id')
      .orderBy('m.order', 'ASC');

    const raw = await qb.getRawMany();

    return raw.map((m) => ({
      ...m,
      totalExercises: Number(m.totalExercises),
      completedExercises: Number(m.completedExercises),
      lessons: [],
    })) as Module[];
  }
}
