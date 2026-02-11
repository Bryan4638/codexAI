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
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto, UpdateLessonDto } from '../dto/lesson.dto';
import { LessonsService } from '../services/lessons.service';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las lecciones' })
  @ApiQuery({
    name: 'moduleId',
    required: false,
    description: 'Filtrar por ID de módulo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de lecciones obtenida exitosamente',
  })
  async findAll(@Query('moduleId') moduleId?: string): Promise<Lesson[]> {
    return this.lessonsService.findAll(moduleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener lección por ID' })
  @ApiResponse({ status: 200, description: 'Lección encontrada' })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Lesson | null> {
    return this.lessonsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva lección' })
  @ApiResponse({ status: 201, description: 'Lección creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonsService.create(createLessonDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar lección' })
  @ApiResponse({ status: 200, description: 'Lección actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar lección' })
  @ApiResponse({ status: 200, description: 'Lección eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Lección no encontrada' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.lessonsService.remove(id);
  }
}
