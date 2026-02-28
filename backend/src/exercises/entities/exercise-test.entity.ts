import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Exercise } from './exercise.entity';

@Entity('exercise_tests')
export class ExerciseTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Descripción legible del test, visible al usuario si is_hidden = false */
  @Column({ type: 'varchar' })
  description: string;

  /**
   * Entrada del test en formato JSON string.
   * Ejemplo: "[2, 3]" para una función que recibe dos parámetros.
   * Puede ser null para ejercicios sin input parametrizado.
   */
  @Column({ type: 'text', nullable: true })
  input: string | null;

  /**
   * Salida esperada del test como string.
   * Ejemplo: "5" o "true" o "aloh"
   */
  @Column({ name: 'expected_output', type: 'text' })
  expectedOutput: string;

  /**
   * Si es `true`, este test NO se muestra al usuario.
   * Los tests ocultos son los más complejos y sirven para
   * validar que la solución sea correcta en casos extremos.
   */
  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  /** Orden de ejecución del test dentro del ejercicio */
  @Column({ default: 0 })
  order: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'exercise_id' })
  exerciseId: string;

  @ManyToOne('Exercise', 'tests', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;
}
