import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';

@Injectable()
export class GetAllLessonsUseCase {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async execute(moduleId?: string): Promise<Lesson[]> {
    const where: { isActive: boolean; moduleId?: string } = { isActive: true };
    if (moduleId) {
      where.moduleId = moduleId;
    }
    return this.lessonRepository.find({
      where,
      order: { order: 'ASC' },
      relations: ['exercises'],
    });
  }
}
