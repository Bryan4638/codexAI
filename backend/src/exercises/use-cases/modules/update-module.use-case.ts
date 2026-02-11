import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../../entities/module.entity';
import { UpdateModuleDto } from '../../dto/module.dto';

@Injectable()
export class UpdateModuleUseCase {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async execute(
    id: string,
    updateModuleDto: UpdateModuleDto,
  ): Promise<Module | null> {
    await this.moduleRepository.update(id, updateModuleDto);
    return this.moduleRepository.findOne({ where: { id } });
  }
}
