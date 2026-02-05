import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UserProgress } from '../../auth/entities/user-progress.entity';
import { ValidateExerciseDto } from '../dto/validate-exercise.dto';
import { getExerciseById } from '../data/exercises.data';
import { CheckAndUnlockBadgesUseCase } from './check-and-unlock-badges.use-case';
import { Badge, Exercise } from '../../common/types';

export interface ValidateExerciseResult {
  correct: boolean;
  message: string;
  explanation?: string;
  xpEarned?: number;
  newBadges?: Badge[];
  levelUp?: boolean;
  newLevel?: number;
}

// Calcular nivel basado en XP
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Validar respuesta de ejercicio
const validateAnswer = (exercise: Exercise, answer: unknown): boolean => {
  switch (exercise.type) {
    case 'quiz':
      return answer === exercise.data.correctAnswer;

    case 'code': {
      // Función auxiliar para normalizar código
      const normalizeCode = (code: string) => {
        return (
          String(code)
            // Añadir espacios alrededor de operadores y puntuación común
            .replace(/([=+\-*/(){};:,<>!&|])/g, ' $1 ')
            // Convertir todo a minúsculas
            .toLowerCase()
            // Reducir múltiples espacios a uno solo y trim
            .replace(/\s+/g, ' ')
            .trim()
        );
      };

      const normalizedAnswer = normalizeCode(answer as string);
      // Normalización menos agresiva para regex (mantiene operadores juntos)
      const regexNormalizedAnswer = String(answer)
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();

      return (
        exercise.data.solutions?.some((sol: string) => {
          if (sol.startsWith('regex:')) {
            const pattern = new RegExp(sol.substring(6));
            return pattern.test(regexNormalizedAnswer);
          }
          return normalizedAnswer.includes(normalizeCode(sol));
        }) ?? false
      );
    }

    case 'dragDrop': {
      if (!Array.isArray(answer)) return false;
      const correctOrder = exercise.data.correctOrder;
      return JSON.stringify(answer) === JSON.stringify(correctOrder);
    }

    case 'fillBlank':
      if (typeof answer !== 'object' || answer === null) return false;
      return (
        exercise.data.blanks?.every((blank) => {
          const userAnswer = String(
            (answer as Record<number, string>)[blank.id] || '',
          )
            .trim()
            .toLowerCase();
          return blank.answers.some((a: string) => {
            if (a.startsWith('regex:')) {
              const pattern = new RegExp(a.substring(6));
              return pattern.test(userAnswer);
            }
            return a.toLowerCase() === userAnswer;
          });
        }) ?? false
      );

    default:
      return false;
  }
};

@Injectable()
export class ValidateExerciseUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProgress)
    private readonly userProgressRepository: Repository<UserProgress>,
    private readonly checkAndUnlockBadgesUseCase: CheckAndUnlockBadgesUseCase,
  ) {}

  async execute(
    userId: string,
    dto: ValidateExerciseDto,
  ): Promise<ValidateExerciseResult> {
    const { exerciseId, answer } = dto;

    const exercise = getExerciseById(exerciseId);
    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    const isCorrect = validateAnswer(exercise, answer);

    if (!isCorrect) {
      return {
        correct: false,
        message:
          exercise.data.hint || 'Respuesta incorrecta. Intenta de nuevo.',
        explanation: exercise.data.explanation,
      };
    }

    // Verificar si ya completó este ejercicio
    const alreadyCompleted = await this.userProgressRepository.findOne({
      where: { userId, exerciseId },
    });

    let xpEarned = 0;
    let levelUp = false;
    let newLevel: number | undefined;

    if (!alreadyCompleted) {
      // Registrar progreso
      const progress = this.userProgressRepository.create({
        userId,
        exerciseId,
      });
      await this.userProgressRepository.save(progress);

      // Añadir XP
      xpEarned = exercise.xpReward;
      const currentUser = await this.userRepository.findOne({
        where: { id: userId },
        select: ['xp', 'level'],
      });

      if (currentUser) {
        const newXp = currentUser.xp + xpEarned;
        const calculatedLevel = calculateLevel(newXp);

        await this.userRepository.update(
          { id: userId },
          { xp: newXp, level: calculatedLevel },
        );

        if (calculatedLevel > currentUser.level) {
          levelUp = true;
          newLevel = calculatedLevel;
        }
      }
    } else {
      // Incrementar intentos
      await this.userProgressRepository.update(
        { userId, exerciseId },
        { attempts: () => 'attempts + 1' },
      );
    }

    // Verificar nuevas medallas
    const newBadges = await this.checkAndUnlockBadgesUseCase.execute(userId);

    return {
      correct: true,
      message: '¡Correcto! Excelente trabajo.',
      explanation: exercise.data.explanation,
      xpEarned,
      newBadges: newBadges.length > 0 ? newBadges : undefined,
      levelUp,
      newLevel,
    };
  }
}
