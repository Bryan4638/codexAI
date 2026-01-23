import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";

export const createChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, initialCode, testCases, difficulty } = req.body;
    const userId = req.userId!;

    if (!title || !description || !initialCode || !testCases || !difficulty) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        initialCode,
        testCases,
        difficulty,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ error: "Error al crear el reto" });
  }
};

export const getChallenges = async (req: Request, res: Response) => {
  try {
    const { difficulty, sort } = req.query;

    let orderBy: any = { createdAt: "desc" };

    if (sort === "popularity") {
      orderBy = {
        reactions: {
          _count: "desc",
        },
      };
    }

    const where: any = {};
    if (difficulty && difficulty !== "all") {
      where.difficulty = String(difficulty);
    }

    const challenges = await prisma.challenge.findMany({
      where,
      orderBy,
      include: {
        author: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { reactions: true },
        },
        reactions: {
          select: {
            userId: true,
          },
        },
      },
    });

    // Transform to add isLiked by current user if token is present?
    // Doing it simple for now, the frontend can check if myId is in reactions list

    res.json(challenges);
  } catch (error) {
    console.error("Error getting challenges:", error);
    res.status(500).json({ error: "Error al obtener los retos" });
  }
};

export const toggleReaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: id,
        },
      },
    });

    if (existingReaction) {
      await prisma.reaction.delete({
        where: {
          userId_challengeId: {
            userId,
            challengeId: id,
          },
        },
      });
      return res.json({ message: "Reacción eliminada", liked: false });
    } else {
      await prisma.reaction.create({
        data: {
          userId,
          challengeId: id,
        },
      });
      return res.json({ message: "Reacción agregada", liked: true });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error);
    res.status(500).json({ error: "Error al reaccionar" });
  }
};

export const deleteChallenge = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      return res.status(404).json({ error: "Reto no encontrado" });
    }

    if (challenge.authorId !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para eliminar este reto" });
    }

    await prisma.challenge.delete({
      where: { id },
    });

    res.json({ message: "Reto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting challenge:", error);
    res.status(500).json({ error: "Error al eliminar el reto" });
  }
};
