import { Router } from "express";
import {
  getLeaderboard,
  getUserPublicProfile,
  updateProfile,
} from "../controllers/leaderboardController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Rutas públicas
router.get("/", getLeaderboard);
router.get("/profile/:userId", getUserPublicProfile);

// Rutas protegidas
router.put("/profile", authMiddleware, updateProfile);

export default router;
