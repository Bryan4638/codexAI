import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import exerciseRoutes from "./routes/exerciseRoutes";
import badgeRoutes from "./routes/badgeRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import executionRoutes from "./routes/execution.routes";
import prisma from "./config/database";

const app = express();
const PORT = process.env.PORT || 4003;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://10.34.0.193:5173",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/execute", executionRoutes);

// Ruta de salud
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      message: "CODEX API funcionando con PostgreSQL",
    });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

// Manejo de errores
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  },
);

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 CODEX API corriendo en http://localhost:${PORT}`);
  console.log(`🐘 Usando PostgreSQL con Prisma ORM`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/me`);
  console.log(`   - GET  /api/exercises`);
  console.log(`   - POST /api/exercises/validate`);
  console.log(`   - GET  /api/badges`);
  console.log(`   - GET  /api/badges/user`);
  console.log(`   - GET  /api/badges/progress`);
});

export default app;
