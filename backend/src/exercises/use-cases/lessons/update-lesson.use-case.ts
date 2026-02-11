import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../../entities/lesson.entity';
import { UpdateLessonDto } from '../../dto/lesson.dto';

@Injectable()
export class UpdateLessonUseCase {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async execute(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    await this.lessonRepository.update(id, updateLessonDto);
    return this.lessonRepository.findOne({ where: { id } });
  }
}
