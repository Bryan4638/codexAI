import { Injectable } from '@nestjs/common';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto, UpdateLessonDto } from '../dto/lesson.dto';
import { GetAllLessonsUseCase } from '../use-cases/lessons/get-all-lessons.use-case';
import { GetLessonByIdUseCase } from '../use-cases/lessons/get-lesson-by-id.use-case';
import { CreateLessonUseCase } from '../use-cases/lessons/create-lesson.use-case';
import { UpdateLessonUseCase } from '../use-cases/lessons/update-lesson.use-case';
import { DeleteLessonUseCase } from '../use-cases/lessons/delete-lesson.use-case';

@Injectable()
export class LessonsService {
  constructor(
    private readonly getAllLessonsUseCase: GetAllLessonsUseCase,
    private readonly getLessonByIdUseCase: GetLessonByIdUseCase,
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
    private readonly deleteLessonUseCase: DeleteLessonUseCase,
  ) {}

  async findAll(moduleId?: string): Promise<Lesson[]> {
    return this.getAllLessonsUseCase.execute(moduleId);
  }

  async findOne(id: string): Promise<Lesson | null> {
    return this.getLessonByIdUseCase.execute(id);
  }

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.createLessonUseCase.execute(createLessonDto);
  }

  async update(
    id: string,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    return this.updateLessonUseCase.execute(id, updateLessonDto);
  }

  async remove(id: string): Promise<void> {
    return this.deleteLessonUseCase.execute(id);
  }
}
