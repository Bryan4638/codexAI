import { Request, Response } from "express";
import { QueueManager } from "../services/QueueManager";

// Instanciar QueueManager (que a su vez instancia DockerManager y el Worker)
const queueManager = new QueueManager();

export const executeCode = async (req: Request, res: Response) => {
  try {
    const { language, code, userId } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Language and code are required",
      });
    }

    // Validar lenguajes soportados
    const supportedLanguages = ["javascript", "python", "java", "csharp"];
    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        error: `Language ${language} not supported. Supported: ${supportedLanguages.join(", ")}`,
      });
    }

    // Agregar trabajo a la cola
    const job = await queueManager.addJob({
      language,
      code,
      userId,
      timeout: 10000, // 10s timeout
    });

    console.log(
      `Job ${job.id} added to queue for user ${userId || "anonymous"}`,
    );

    // Esperar resultado del trabajo
    // Nota: job.finished() devuelve una promesa que se resuelve cuando el trabajo termina
    // Esto mantiene la conexión HTTP abierta hasta que termina.
    // Para cargas muy altas, se recomienda devolver el jobID y hacer polling,
    // pero para este caso de uso (code runner directo) es aceptable esperar.
    try {
      const result = await job.finished();

      // Intentar parsear el output si es JSON
      // (Lógica reutilizada del controller anterior)
      if (result && typeof result === "object" && "output" in result) {
        let parsedOutput = result.output;
        try {
          // Buscamos si el output contiene un JSON object
          const jsonMatch = result.output.match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return res.json({
              ...parsed,
              executionTime: "N/A",
              exitCode: result.exitCode,
            });
          }
        } catch (e) {
          // Ignore parse error
          console.log(e);
        }
      }

      res.json(result);
    } catch (jobError: any) {
      // Si el job falla (lanza excepción/throw)
      console.error(`Job ${job.id} execution failed:`, jobError);
      res.status(500).json({
        success: false,
        error: jobError.message || "Execution failed in worker",
        exitCode: -1,
      });
    }
  } catch (error: any) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};
