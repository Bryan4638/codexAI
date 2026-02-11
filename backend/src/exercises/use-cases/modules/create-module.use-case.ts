import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../../entities/module.entity';
import { CreateModuleDto } from '../../dto/module.dto';

@Injectable()
export class CreateModuleUseCase {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async execute(createModuleDto: CreateModuleDto): Promise<Module> {
    const module = this.moduleRepository.create(createModuleDto);
    return this.moduleRepository.save(module);
  }
}
