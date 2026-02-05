import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../entities/reaction.entity';

@Injectable()
export class ToggleReactionUseCase {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async execute(userId: string, challengeId: string) {
    const existingReaction = await this.reactionRepository.findOne({
      where: { userId, challengeId },
    });

    if (existingReaction) {
      await this.reactionRepository.remove(existingReaction);
      return { message: 'Reacción eliminada', liked: false };
    } else {
      const reaction = this.reactionRepository.create({
        userId,
        challengeId,
      });
      await this.reactionRepository.save(reaction);
      return { message: 'Reacción agregada', liked: true };
    }
  }
}
