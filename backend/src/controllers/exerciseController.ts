import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { exercises, getExerciseById } from "../data/exercises";
import { badges } from "../data/badges";
import { Badge } from "../types";

// Calcular nivel basado en XP
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

// Verificar y desbloquear medallas
const checkAndUnlockBadges = async (userId: string): Promise<Badge[]> => {
  const unlockedBadges: Badge[] = [];

  // Obtener estadísticas del usuario
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  });

  if (!user) return [];

  const completedCount = await prisma.userProgress.count({
    where: { userId },
  });

  // Obtener ejercicios completados por módulo
  const completedExercises = await prisma.userProgress.findMany({
    where: { userId },
    select: { exerciseId: true },
  });

  const completedByModule: Record<number, number> = {};
  completedExercises.forEach(({ exerciseId }) => {
    const exercise = getExerciseById(exerciseId);
    if (exercise) {
      completedByModule[exercise.moduleId] =
        (completedByModule[exercise.moduleId] || 0) + 1;
    }
  });

  // Verificar cada medalla
  for (const badge of badges) {
    // Verificar si ya tiene la medalla
    const hasBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: { userId, badgeId: badge.id },
      },
    });

    if (hasBadge) continue;

    let shouldUnlock = false;

    switch (badge.requirement.type) {
      case "exercises_completed":
        shouldUnlock = completedCount >= badge.requirement.value;
        break;
      case "level_reached":
        shouldUnlock = user.level >= badge.requirement.value;
        break;
      case "module_completed":
        const moduleId = badge.requirement.moduleId!;
        const moduleExercises = exercises.filter(
          (e) => e.moduleId === moduleId,
        ).length;
        shouldUnlock = (completedByModule[moduleId] || 0) >= moduleExercises;
        break;
    }

    if (shouldUnlock) {
      await prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
      });
      unlockedBadges.push(badge);
    }
  }

  return unlockedBadges;
};

// Validar respuesta de ejercicio
const validateAnswer = (
  exercise: (typeof exercises)[0],
  answer: any,
): boolean => {
  switch (exercise.type) {
    case "quiz":
      return answer === exercise.data.correctAnswer;

    case "code":
      // Función auxiliar para normalizar código
      const normalizeCode = (code: string) => {
        return (
          String(code)
            // Añadir espacios alrededor de operadores y puntuación común
            .replace(/([=+\-*/()\{\};:,<>!&|])/g, " $1 ")
            // Convertir todo a minúsculas
            .toLowerCase()
            // Reducir múltiples espacios a uno solo y trim
            .replace(/\s+/g, " ")
            .trim()
        );
      };

      const normalizedAnswer = normalizeCode(answer);
      // Normalización menos agresiva para regex (mantiene operadores juntos)
      const regexNormalizedAnswer = String(answer)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

      return exercise.data.solutions.some((sol: string) => {
        if (sol.startsWith("regex:")) {
          const pattern = new RegExp(sol.substring(6));
          return pattern.test(regexNormalizedAnswer);
        }
        return normalizedAnswer.includes(normalizeCode(sol));
      });

    case "dragDrop":
      if (!Array.isArray(answer)) return false;
      const correctOrder = exercise.data.correctOrder;
      return JSON.stringify(answer) === JSON.stringify(correctOrder);

    case "fillBlank":
      if (typeof answer !== "object") return false;
      return exercise.data.blanks.every((blank: any) => {
        const userAnswer = String(answer[blank.id] || "")
          .trim()
          .toLowerCase();
        return blank.answers.some((a: string) => {
          if (a.startsWith("regex:")) {
            const pattern = new RegExp(a.substring(6));
            return pattern.test(userAnswer);
          }
          return a.toLowerCase() === userAnswer;
        });
      });

    default:
      return false;
  }
};

export const getAllExercises = (req: Request, res: Response) => {
  const { moduleId, lessonId, difficulty } = req.query;

  let filtered = exercises;

  if (moduleId) {
    filtered = filtered.filter((e) => e.moduleId === Number(moduleId));
  }
  if (lessonId) {
    filtered = filtered.filter((e) => e.lessonId === String(lessonId));
  }
  if (difficulty) {
    filtered = filtered.filter((e) => e.difficulty === String(difficulty));
  }

  // No enviar las soluciones al cliente
  const safeExercises = filtered.map(({ data, ...rest }) => ({
    ...rest,
    data: {
      ...data,
      solutions: undefined,
      correctAnswer: undefined,
      correctOrder: undefined,
      blanks: data.blanks?.map((b: any) => ({ id: b.id })),
    },
  }));

  res.json({ exercises: safeExercises });
};

export const validateExercise = async (req: AuthRequest, res: Response) => {
  try {
    const { exerciseId, answer } = req.body;
    const userId = req.userId!;

    if (!exerciseId || answer === undefined) {
      return res
        .status(400)
        .json({ error: "exerciseId y answer son requeridos" });
    }

    const exercise = getExerciseById(exerciseId);
    if (!exercise) {
      return res.status(404).json({ error: "Ejercicio no encontrado" });
    }

    const isCorrect = validateAnswer(exercise, answer);

    if (!isCorrect) {
      return res.json({
        correct: false,
        message:
          exercise.data.hint || "Respuesta incorrecta. Intenta de nuevo.",
        explanation: exercise.data.explanation,
      });
    }

    // Verificar si ya completó este ejercicio
    const alreadyCompleted = await prisma.userProgress.findUnique({
      where: {
        userId_exerciseId: { userId, exerciseId },
      },
    });

    let xpEarned = 0;
    let levelUp = false;
    let newLevel: number | undefined;

    if (!alreadyCompleted) {
      // Registrar progreso
      await prisma.userProgress.create({
        data: { userId, exerciseId },
      });

      // Añadir XP
      xpEarned = exercise.xpReward;
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true, level: true },
      });

      if (currentUser) {
        const newXp = currentUser.xp + xpEarned;
        const calculatedLevel = calculateLevel(newXp);

        await prisma.user.update({
          where: { id: userId },
          data: { xp: newXp, level: calculatedLevel },
        });

        if (calculatedLevel > currentUser.level) {
          levelUp = true;
          newLevel = calculatedLevel;
        }
      }
    } else {
      // Incrementar intentos
      await prisma.userProgress.update({
        where: { userId_exerciseId: { userId, exerciseId } },
        data: { attempts: { increment: 1 } },
      });
    }

    // Verificar nuevas medallas
    const newBadges = await checkAndUnlockBadges(userId);

    res.json({
      correct: true,
      message: "¡Correcto! Excelente trabajo.",
      explanation: exercise.data.explanation,
      xpEarned,
      newBadges: newBadges.length > 0 ? newBadges : undefined,
      levelUp,
      newLevel,
    });
  } catch (error) {
    console.error("Error validando ejercicio:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getExercise = (req: Request, res: Response) => {
  const { id } = req.params;
  const exercise = getExerciseById(String(id));

  if (!exercise) {
    return res.status(404).json({ error: "Ejercicio no encontrado" });
  }

  // No enviar soluciones
  const { data, ...rest } = exercise;
  const safeData = {
    ...data,
    solutions: undefined,
    correctAnswer: undefined,
    correctOrder: undefined,
  };

  res.json({ exercise: { ...rest, data: safeData } });
};

export default { getAllExercises, validateExercise, getExercise };
