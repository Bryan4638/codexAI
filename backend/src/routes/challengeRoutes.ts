import { Router } from "express";
import {
  createChallenge,
  getChallenges,
  toggleReaction,
  deleteChallenge,
} from "../controllers/challengeController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getChallenges);
router.post("/", authMiddleware, createChallenge);
router.post("/:id/react", authMiddleware, toggleReaction);
router.delete("/:id", authMiddleware, deleteChallenge);

export default router;
