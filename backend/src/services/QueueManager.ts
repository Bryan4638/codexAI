import Queue from "bull";
import { DockerManager } from "./DockerManager";

interface ExecutionJob {
  language: "javascript" | "python" | "java" | "csharp";
  code: string;
  userId?: string;
  timeout?: number;
}

export class QueueManager {
  private queue: Queue.Queue<ExecutionJob>;
  private dockerManager: DockerManager;

  constructor() {
    this.dockerManager = new DockerManager();

    // Configuración de Redis
    const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

    this.queue = new Queue("execution-queue", redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true, // Limpiar trabajos completados
        removeOnFail: 100, // Mantener últimos 100 fallidos para debug
        attempts: 1, // No reintentar por defecto si falla la ejecución (error de código vs error de sistema)
      },
    });

    this.initializeWorker();
  }

  private initializeWorker() {
    console.log("👷 Initializing Queue Worker...");

    // Procesar trabajos
    // Concurrencia: 5 trabajos simultáneos (ajustable según recursos)
    this.queue.process(5, async (job) => {
      const { language, code, userId, timeout } = job.data;

      console.log(
        `Job ${job.id}: Processing ${language} execution for user ${userId || "anonymous"}`,
      );

      try {
        const result = await this.dockerManager.executeCode(
          language,
          code,
          timeout,
        );

        // Retornar resultado
        // Bull guarda esto y lo hace disponible para quien espera el trabajo
        return result;
      } catch (error: any) {
        console.error(`Job ${job.id} failed:`, error);
        throw error; // Esto marcará el job como failed
      }
    });

    this.queue.on("completed", (job, result) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.queue.on("failed", (job, err) => {
      console.error(`Job ${job.id} failed with error ${err.message}`);
    });
  }

  public async addJob(data: ExecutionJob): Promise<Queue.Job<ExecutionJob>> {
    return this.queue.add(data);
  }

  public getQueue(): Queue.Queue<ExecutionJob> {
    return this.queue;
  }
}
