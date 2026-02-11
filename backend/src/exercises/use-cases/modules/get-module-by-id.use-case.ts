import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../../entities/module.entity';

@Injectable()
export class GetModuleByIdUseCase {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async execute(id: string): Promise<Module | null> {
    return this.moduleRepository.findOne({
      where: { id },
      relations: ['lessons', 'lessons.exercises'],
    });
  }
}
