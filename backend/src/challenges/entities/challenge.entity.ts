import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import type { User } from '../../auth/entities/user.entity';
import type { Reaction } from './reaction.entity';
import { ChallengeTest } from './challenge-test.entity';
import { UserChallengeProgress } from './user-challenge-progress.entity';

@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: 'initial_code' })
  initialCode: string;

  @Column({ name: 'test_cases', type: 'jsonb', default: [] })
  testCases: unknown;

  @Column()
  difficulty: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'author_id' })
  authorId: string;

  @ManyToOne('User', 'challenges')
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany('Reaction', 'challenge')
  reactions: Reaction[];

  @OneToMany(() => ChallengeTest, (test) => test.challenge, { cascade: true })
  tests: ChallengeTest[];

  @OneToMany(() => UserChallengeProgress, (progress) => progress.challenge)
  userProgress: UserChallengeProgress[];
}
