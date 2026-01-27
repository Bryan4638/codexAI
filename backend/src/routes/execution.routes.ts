import { Router } from "express";
import { executeCode } from "../controllers/ExecutionController";

const router = Router();

// Route is mounted at /api/execute, so this becomes POST /api/execute
router.post("/", executeCode);

export default router;
