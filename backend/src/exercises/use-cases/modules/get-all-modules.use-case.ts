import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from '../../entities/module.entity';

@Injectable()
export class GetAllModulesUseCase {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async execute(): Promise<Module[]> {
    return this.moduleRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
      relations: ['lessons'],
    });
  }
}
