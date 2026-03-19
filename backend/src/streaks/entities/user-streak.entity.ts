import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('user_streaks')
export class UserStreak {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'current_streak', type: 'int', default: 0 })
  currentStreak: number;

  @Column({ name: 'longest_streak', type: 'int', default: 0 })
  longestStreak: number;

  @Column({ name: 'last_activity_date', type: 'date', nullable: true })
  lastActivityDate: string | null;

  @Column({ name: 'streak_start_date', type: 'date', nullable: true })
  streakStartDate: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
