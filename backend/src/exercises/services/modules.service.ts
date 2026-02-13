import { Injectable } from '@nestjs/common';
import { Module } from '../entities/module.entity';
import { CreateModuleDto, UpdateModuleDto } from '../dto/module.dto';
import { GetAllModulesUseCase } from '../use-cases/modules/get-all-modules.use-case';
import { GetModuleByIdUseCase } from '../use-cases/modules/get-module-by-id.use-case';
import { CreateModuleUseCase } from '../use-cases/modules/create-module.use-case';
import { UpdateModuleUseCase } from '../use-cases/modules/update-module.use-case';
import { DeleteModuleUseCase } from '../use-cases/modules/delete-module.use-case';

@Injectable()
export class ModulesService {
  constructor(
    private readonly getAllModulesUseCase: GetAllModulesUseCase,
    private readonly getModuleByIdUseCase: GetModuleByIdUseCase,
    private readonly createModuleUseCase: CreateModuleUseCase,
    private readonly updateModuleUseCase: UpdateModuleUseCase,
    private readonly deleteModuleUseCase: DeleteModuleUseCase,
  ) {}

  async findAll(userId?: string): Promise<Module[]> {
    return this.getAllModulesUseCase.execute(userId);
  }

  async findOne(id: string): Promise<Module | null> {
    return this.getModuleByIdUseCase.execute(id);
  }

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    return this.createModuleUseCase.execute(createModuleDto);
  }

  async update(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<Module | null> {
    return this.updateModuleUseCase.execute(id, updateModuleDto);
  }

  async remove(id: string): Promise<void> {
    return this.deleteModuleUseCase.execute(id);
  }
}
