import { Router } from "express";
import {
  getAllBadges,
  getUserBadges,
  getUserProgress,
} from "../controllers/badgeController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllBadges);
router.get("/user", authMiddleware, getUserBadges);
router.get("/progress", authMiddleware, getUserProgress);

export default router;
