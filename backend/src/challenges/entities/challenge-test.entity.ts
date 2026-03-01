import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Challenge } from './challenge.entity';

@Entity('challenge_tests')
export class ChallengeTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Challenge, (challenge) => challenge.tests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'challenge_id' })
  challenge: Challenge;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  input: string;

  @Column({ name: 'expected_output', type: 'text' })
  expectedOutput: string;

  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  @Column({ default: 0 })
  order: number;
}
