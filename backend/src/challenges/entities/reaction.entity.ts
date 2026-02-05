import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import type { User } from '../../auth/entities/user.entity';
import { Challenge } from './challenge.entity';

@Entity('reactions')
@Unique(['userId', 'challengeId'])
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'challenge_id' })
  challengeId: string;

  @Column({ default: 'LIKE' })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne('User', 'reactions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.reactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;
}
