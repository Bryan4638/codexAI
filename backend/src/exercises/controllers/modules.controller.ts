import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Module } from '../entities/module.entity';
import { CreateModuleDto, UpdateModuleDto } from '../dto/module.dto';
import { ModulesService } from '../services/modules.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/entities/user.entity';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';

@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de módulos obtenida exitosamente',
  })
  @ApiBearerAuth()
  async findAll(@CurrentUser() user: User | null): Promise<Module[]> {
    return this.modulesService.findAll(user?.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener módulo por ID' })
  @ApiResponse({ status: 200, description: 'Módulo encontrado' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Module | null> {
    return this.modulesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo módulo' })
  @ApiResponse({ status: 201, description: 'Módulo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return this.modulesService.create(createModuleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar módulo' })
  @ApiResponse({ status: 200, description: 'Módulo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module | null> {
    return this.modulesService.update(id, updateModuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar módulo' })
  @ApiResponse({ status: 200, description: 'Módulo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Módulo no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.modulesService.remove(id);
  }
}
