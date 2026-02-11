import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';

@Injectable()
export class DeleteLessonUseCase {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async execute(id: string): Promise<void> {
    await this.lessonRepository.delete(id);
  }
}
