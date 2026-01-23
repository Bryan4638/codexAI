import { Router } from "express";
import {
  getAllExercises,
  validateExercise,
  getExercise,
} from "../controllers/exerciseController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllExercises);
router.get("/:id", getExercise);
router.post("/validate", authMiddleware, validateExercise);

export default router;
