import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface GetCurrentUserResult {
  user: {
    id: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    createdAt: Date;
  };
}

@Injectable()
export class GetCurrentUserUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(userId: string): Promise<GetCurrentUserResult> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'xp', 'level', 'createdAt'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return { user };
  }
}
