import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { badges } from "../data/badges";
import { exercises, getExerciseById } from "../data/exercises";

export const getAllBadges = (req: Request, res: Response) => {
  res.json({ badges });
};

export const getUserBadges = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true, unlockedAt: true },
    });

    const badgesWithDetails = userBadges.map((ub) => {
      const badge = badges.find((b) => b.id === ub.badgeId);
      return {
        ...badge,
        unlocked_at: ub.unlockedAt,
      };
    });

    res.json({
      badges: badgesWithDetails,
      total: badges.length,
      unlocked: userBadges.length,
    });
  } catch (error) {
    console.error("Error obteniendo medallas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getUserProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true, level: true },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Obtener ejercicios completados
    const completedExercises = await prisma.userProgress.findMany({
      where: { userId },
      select: { exerciseId: true, completedAt: true, attempts: true },
      orderBy: { completedAt: "desc" },
    });

    // Calcular progreso por módulo
    const moduleProgress: Record<number, { total: number; completed: number }> =
      {};

    [1, 2, 3, 4].forEach((moduleId) => {
      const moduleExercises = exercises.filter((e) => e.moduleId === moduleId);
      const completedInModule = completedExercises.filter((ce) => {
        const ex = getExerciseById(ce.exerciseId);
        return ex && ex.moduleId === moduleId;
      });

      moduleProgress[moduleId] = {
        total: moduleExercises.length,
        completed: completedInModule.length,
      };
    });

    // Calcular XP para siguiente nivel
    const nextLevelXp = Math.pow(user.level, 2) * 100;
    const prevLevelXp = Math.pow(user.level - 1, 2) * 100;
    const levelProgress =
      ((user.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100;

    // Calcular lecciones completadas
    const completedLessons: string[] = [];
    const lessons = Array.from(new Set(exercises.map((e) => e.lessonId)));

    lessons.forEach((lessonId) => {
      const lessonExercises = exercises.filter((e) => e.lessonId === lessonId);
      const isCompleted = lessonExercises.every((le: any) =>
        completedExercises.some((ce) => ce.exerciseId === le.id),
      );

      if (isCompleted && lessonExercises.length > 0) {
        completedLessons.push(lessonId);
      }
    });

    res.json({
      xp: user.xp,
      level: user.level,
      nextLevelXp,
      levelProgress: Math.min(100, Math.max(0, levelProgress)),
      totalExercises: exercises.length,
      completedExercises: completedExercises.length,
      completedLessons, // Enviar lecciones completadas
      moduleProgress,
      recentActivity: completedExercises.slice(0, 10).map((ce) => ({
        exercise_id: ce.exerciseId,
        completed_at: ce.completedAt,
        attempts: ce.attempts,
      })),
      history: completedExercises.map((ce) => {
        const ex = getExerciseById(ce.exerciseId);
        return {
          id: ce.exerciseId,
          title: ex ? ex.prompt : "Ejercicio desconocido",
          completedAt: ce.completedAt,
          attempts: ce.attempts,
        };
      }),
    });
  } catch (error) {
    console.error("Error obteniendo progreso:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default { getAllBadges, getUserBadges, getUserProgress };
