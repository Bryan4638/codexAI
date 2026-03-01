import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Challenge } from './challenge.entity';

@Entity('user_challenge_progress')
@Unique(['user', 'challenge'])
export class UserChallengeProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.challengeProgress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.userProgress, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;

  @Column({
    name: 'best_execution_time_ms',
    type: 'decimal',
    precision: 10,
    scale: 3,
    nullable: true,
  })
  bestExecutionTimeMs: number;

  @Column({ default: 1 })
  attempts: number;
}
