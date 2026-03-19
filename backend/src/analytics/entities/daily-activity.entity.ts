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

@Entity('daily_activity')
@Unique(['userId', 'activityDate'])
export class DailyActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'activity_date', type: 'date' })
  activityDate: string;

  @Column({ name: 'exercises_completed', type: 'int', default: 0 })
  exercisesCompleted: number;

  @Column({ name: 'challenges_completed', type: 'int', default: 0 })
  challengesCompleted: number;

  @Column({ name: 'xp_earned', type: 'int', default: 0 })
  xpEarned: number;

  @Column({ name: 'time_spent_minutes', type: 'int', default: 0 })
  timeSpentMinutes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
