import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';

@Injectable()
export class GetLessonByIdUseCase {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async execute(id: string): Promise<Lesson | null> {
    return this.lessonRepository.findOne({
      where: { id },
      relations: ['exercises', 'module'],
    });
  }
}
