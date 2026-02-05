import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';
import { CreateChallengeDto } from '../dto/create-challenge.dto';

@Injectable()
export class CreateChallengeUseCase {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async execute(userId: string, dto: CreateChallengeDto) {
    const challenge = this.challengeRepository.create({
      title: dto.title,
      description: dto.description,
      initialCode: dto.initialCode,
      testCases: dto.testCases,
      difficulty: dto.difficulty,
      authorId: userId,
    });

    await this.challengeRepository.save(challenge);

    // Cargar con relaciones
    const savedChallenge = await this.challengeRepository.findOne({
      where: { id: challenge.id },
      relations: ['author'],
      select: {
        author: {
          username: true,
          avatarUrl: true,
        },
      },
    });

    return savedChallenge;
  }
}
