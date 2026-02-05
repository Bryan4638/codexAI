import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Challenge } from '../entities/challenge.entity';

@Injectable()
export class DeleteChallengeUseCase {
  constructor(
    @InjectRepository(Challenge)
    private readonly challengeRepository: Repository<Challenge>,
  ) {}

  async execute(userId: string, challengeId: string) {
    const challenge = await this.challengeRepository.findOne({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Reto no encontrado');
    }

    if (challenge.authorId !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar este reto');
    }

    await this.challengeRepository.remove(challenge);

    return { message: 'Reto eliminado correctamente' };
  }
}
