import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { Lesson } from './entities/lesson.entity';
import { CreateLessonDto, UpdateLessonDto } from './dto/lesson.dto';
import { GetAllLessonsUseCase } from './use-cases/lessons/get-all-lessons.use-case';
import { GetLessonByIdUseCase } from './use-cases/lessons/get-lesson-by-id.use-case';
import { CreateLessonUseCase } from './use-cases/lessons/create-lesson.use-case';
import { UpdateLessonUseCase } from './use-cases/lessons/update-lesson.use-case';
import { DeleteLessonUseCase } from './use-cases/lessons/delete-lesson.use-case';

@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly getAllLessonsUseCase: GetAllLessonsUseCase,
    private readonly getLessonByIdUseCase: GetLessonByIdUseCase,
    private readonly createLessonUseCase: CreateLessonUseCase,
    private readonly updateLessonUseCase: UpdateLessonUseCase,
    private readonly deleteLessonUseCase: DeleteLessonUseCase,
  ) {}

  @Get()
  async findAll(@Query('moduleId') moduleId?: string): Promise<Lesson[]> {
    return this.getAllLessonsUseCase.execute(moduleId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Lesson | null> {
    return this.getLessonByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.createLessonUseCase.execute(createLessonDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    return this.updateLessonUseCase.execute(id, updateLessonDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteLessonUseCase.execute(id);
  }
}
