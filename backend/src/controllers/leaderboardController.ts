import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { badges } from "../data/badges";

// Obtener leaderboard ordenado por número de medallas y XP
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
        isPublic: true,
        avatarUrl: true,
        bio: true,
        badges: {
          select: { badgeId: true, unlockedAt: true },
        },
      },
      orderBy: [{ level: "desc" }, { xp: "desc" }],
    });

    // Calcular ranking con medallas
    const leaderboard = users.map((user, index) => {
      const userBadges = user.badges
        .map((ub) => {
          const badge = badges.find((b) => b.id === ub.badgeId);
          return badge ? { ...badge, unlockedAt: ub.unlockedAt } : null;
        })
        .filter(Boolean);

      return {
        rank: index + 1,
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        isPublic: user.isPublic,
        avatarUrl: user.avatarUrl,
        bio: user.isPublic ? user.bio : null,
        badgeCount: userBadges.length,
        topBadge: userBadges[0] || null,
      };
    });

    // Ordenar por cantidad de medallas primero, luego por XP
    leaderboard.sort((a, b) => {
      if (b.badgeCount !== a.badgeCount) return b.badgeCount - a.badgeCount;
      return b.xp - a.xp;
    });

    // Reasignar ranks después de ordenar
    leaderboard.forEach((user, index) => {
      user.rank = index + 1;
    });

    res.json({
      leaderboard,
      totalUsers: leaderboard.length,
    });
  } catch (error) {
    console.error("Error obteniendo leaderboard:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener perfil público de un usuario
export const getUserPublicProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        xp: true,
        level: true,
        isPublic: true,
        bio: true,
        github: true,
        linkedin: true,
        twitter: true,
        website: true,
        avatarUrl: true,
        createdAt: true,
        badges: {
          select: { badgeId: true, unlockedAt: true },
        },
        _count: {
          select: { progress: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si el perfil es privado, solo mostrar info básica
    if (!user.isPublic) {
      const userBadges = user.badges
        .map((ub) => {
          const badge = badges.find((b) => b.id === ub.badgeId);
          return badge ? { icon: badge.icon, name: badge.name } : null;
        })
        .filter(Boolean);

      return res.json({
        profile: {
          id: user.id,
          username: user.username,
          level: user.level,
          isPublic: false,
          badgeCount: userBadges.length,
          topBadge: userBadges[0] || null,
        },
      });
    }

    // Perfil público completo
    const userBadges = user.badges
      .map((ub) => {
        const badge = badges.find((b) => b.id === ub.badgeId);
        return badge ? { ...badge, unlockedAt: ub.unlockedAt } : null;
      })
      .filter(Boolean);

    res.json({
      profile: {
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        isPublic: true,
        bio: user.bio,
        contact: {
          github: user.github,
          linkedin: user.linkedin,
          twitter: user.twitter,
          website: user.website,
        },
        avatarUrl: user.avatarUrl,
        memberSince: user.createdAt,
        exercisesCompleted: user._count.progress,
        badges: userBadges,
        badgeCount: userBadges.length,
      },
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar perfil del usuario autenticado
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { bio, github, linkedin, twitter, website, avatarUrl, isPublic } =
      req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(github !== undefined && { github }),
        ...(linkedin !== undefined && { linkedin }),
        ...(twitter !== undefined && { twitter }),
        ...(website !== undefined && { website }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(isPublic !== undefined && { isPublic }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        level: true,
        isPublic: true,
        bio: true,
        github: true,
        linkedin: true,
        twitter: true,
        website: true,
        avatarUrl: true,
      },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export default { getLeaderboard, getUserPublicProfile, updateProfile };
