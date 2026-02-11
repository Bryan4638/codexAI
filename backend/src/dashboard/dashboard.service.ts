import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Lesson } from '../exercises/entities/lesson.entity';
import { Module as ModuleEntity } from '../exercises/entities/module.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) {}

  async getData() {
    const [modulesCount, lessonsCount, exercisesCount] = await Promise.all([
      this.moduleRepository.count(),
      this.lessonRepository.count(),
      this.exerciseRepository.count(),
    ]);

    return {
      modules: modulesCount,
      lessons: lessonsCount,
      exercises: exercisesCount,
    };
  }
}
