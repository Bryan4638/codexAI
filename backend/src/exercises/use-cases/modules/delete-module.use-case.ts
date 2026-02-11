import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../../entities/module.entity';

@Injectable()
export class DeleteModuleUseCase {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async execute(id: string): Promise<void> {
    await this.moduleRepository.delete(id);
  }
}
