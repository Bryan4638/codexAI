import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import type { Lesson } from './lesson.entity';
import type { ExerciseTest } from './exercise-test.entity';

export type ExerciseType = 'code' | 'quiz' | 'dragDrop' | 'fillBlank';
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['code', 'quiz', 'dragDrop', 'fillBlank'],
  })
  type: ExerciseType;

  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced'],
  })
  difficulty: ExerciseDifficulty;

  @Column({ name: 'xp_reward', default: 10 })
  xpReward: number;

  @Column({ type: 'text' })
  prompt: string;

  @Column({ type: 'jsonb' })
  data: Record<string, unknown>;

  @Column({ default: 0 })
  order: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'lesson_id' })
  lessonId: string;

  @ManyToOne('Lesson', 'exercises', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @OneToMany('ExerciseTest', 'exercise')
  tests: ExerciseTest[];
}
