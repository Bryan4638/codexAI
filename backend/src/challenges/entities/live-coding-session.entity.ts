import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Challenge } from './challenge.entity';

@Entity('live_coding_sessions')
export class LiveCodingSession {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => Challenge, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'challenge_id' })
    challenge: Challenge;

    @Column({ name: 'challenge_id' })
    challengeId: string;

    @Column({ type: 'text', nullable: true })
    code: string;

    @Column({ name: 'time_taken_seconds', type: 'int', nullable: true })
    timeTakenSeconds: number;

    @Column({
        name: 'execution_time_ms',
        type: 'decimal',
        precision: 10,
        scale: 3,
        nullable: true,
    })
    executionTimeMs: number;

    @Column({ type: 'int', default: 0 })
    score: number;

    @Column({ name: 'tab_switches', type: 'int', default: 0 })
    tabSwitches: number;

    @Column({ name: 'paste_count', type: 'int', default: 0 })
    pasteCount: number;

    @Column({ name: 'penalties_applied', type: 'int', default: 0 })
    penaltiesApplied: number;

    @Column({ name: 'all_tests_passed', type: 'boolean', default: false })
    allTestsPassed: boolean;

    @CreateDateColumn({ name: 'started_at' })
    startedAt: Date;

    @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
    completedAt: Date;
}
