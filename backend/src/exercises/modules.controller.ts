import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Module } from './entities/module.entity';
import { CreateModuleDto, UpdateModuleDto } from './dto/module.dto';
import { GetAllModulesUseCase } from './use-cases/modules/get-all-modules.use-case';
import { GetModuleByIdUseCase } from './use-cases/modules/get-module-by-id.use-case';
import { CreateModuleUseCase } from './use-cases/modules/create-module.use-case';
import { UpdateModuleUseCase } from './use-cases/modules/update-module.use-case';
import { DeleteModuleUseCase } from './use-cases/modules/delete-module.use-case';

@Controller('modules')
export class ModulesController {
  constructor(
    private readonly getAllModulesUseCase: GetAllModulesUseCase,
    private readonly getModuleByIdUseCase: GetModuleByIdUseCase,
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly updateModuleUseCase: UpdateModuleUseCase,
    private readonly deleteModuleUseCase: DeleteModuleUseCase,
  ) {}

  @Get()
  async findAll(): Promise<Module[]> {
    return this.getAllModulesUseCase.execute();
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Module | null> {
    return this.getModuleByIdUseCase.execute(id);
  }

  @Post()
  async create(@Body() createModuleDto: CreateModuleDto): Promise<Module> {
    return this.createModuleUseCase.execute(createModuleDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ): Promise<Module | null> {
    return this.updateModuleUseCase.execute(id, updateModuleDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteModuleUseCase.execute(id);
  }
}
