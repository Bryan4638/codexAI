import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { UserBadge } from './user-badge.entity';
import { Challenge } from '../../challenges/entities/challenge.entity';
import type { Reaction } from '../../challenges/entities/reaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 1 })
  level: number;

  @Column({ name: 'is_public', default: true })
  isPublic: boolean;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  website: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => UserProgress, (progress) => progress.user)
  progress: UserProgress[];

  @OneToMany(() => UserBadge, (badge) => badge.user)
  badges: UserBadge[];

  @OneToMany(() => Challenge, (challenge) => challenge.author)
  challenges: Challenge[];

  @OneToMany('Reaction', 'user')
  reactions: Reaction[];
}
