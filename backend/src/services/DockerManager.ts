import Docker, { Container } from "dockerode";

const docker = new Docker();

type Language = "javascript" | "python" | "java" | "csharp";

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string;
  exitCode: number;
}

export class DockerManager {
  private images: Record<Language, string> = {
    javascript: "code-platform-js",
    python: "code-platform-python",
    java: "code-platform-java",
    csharp: "code-platform-csharp",
  };

  async executeCode(
    language: Language,
    code: string,
    timeout: number = 10000,
  ): Promise<ExecutionResult> {
    const imageName = this.images[language];

    if (!imageName) {
      throw new Error(`Language not supported: ${language}`);
    }

    const containerConfig: Docker.ContainerCreateOptions = {
      Image: imageName,
      Cmd: [], // Command is defined in Dockerfile/runner
      HostConfig: {
        NetworkMode: "none",
        Memory: 512 * 1024 * 1024, // 512MB to support java/csharp
        // MemorySwap: 0, // Removed to avoid potential OOM killing or invalid config on some kernels
        CpuPeriod: 100000,
        CpuQuota: 50000,
        ReadonlyRootfs: false, // Changed to false temporarily to debug write issues if any
        CapDrop: ["ALL"],
        SecurityOpt: ["no-new-privileges:true"],
        Ulimits: [{ Name: "nofile", Soft: 1024, Hard: 1024 }],
      },
      Env: [
        "PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "HOME=/tmp",
        "TMPDIR=/tmp",
      ],
      WorkingDir: "/app",
      User: "1000:1000",
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: true,
      StdinOnce: true,
      Tty: false,
    };

    let container: Container | null = null;

    try {
      container = await docker.createContainer(containerConfig);

      await container.start();

      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
        hijack: true, // Important for interactive streams
        logs: true, // Capture logs from the beginning
      });

      let stdout = "";
      let stderr = "";

      const outputPromise = new Promise<{ stdout: string; stderr: string }>(
        (resolve, reject) => {
          container!.modem.demuxStream(
            stream,
            {
              write: (data: Buffer) => (stdout += data.toString()),
            },
            {
              write: (data: Buffer) => (stderr += data.toString()),
            },
          );
          stream.on("end", () => resolve({ stdout, stderr }));
          stream.on("error", reject);
        },
      );

      stream.write(code + "\n");

      // Pequeña pausa para asegurar que el buffer se envíe antes de cerrar stdin
      await new Promise((resolve) => setTimeout(resolve, 100));

      stream.end();

      // Esperar resultado o timeout
      // Note: Promise.race with timeout
      // IMPORTANTE: stream 'end' puede tardar. Mejor esperar a que el container termine.
      const waitPromise = container.wait();

      const finished = await Promise.race([
        waitPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Execution Timeout")), timeout),
        ),
      ]);

      // Si llegamos aqui, el container termino (o timeout).
      // Ahora podemos esperar a que los streams terminen de leer
      // IMPORTANTE: A veces outputPromise no se resuelve si no se cierra el stream adecuadamente
      // Agregamos un pequeño timeout extra para permitir que el stream haga flush

      const result = await Promise.race([
        outputPromise,
        new Promise<{ stdout: string; stderr: string }>((resolve) =>
          setTimeout(() => resolve({ stdout, stderr }), 2000),
        ),
      ]);

      const containerInfo = await waitPromise; // Ya esta resuelto

      let parsedOutput = result.stdout;
      let parsedSuccess = containerInfo.StatusCode === 0;
      let parsedError = result.stderr;

      try {
        // Intentar parsear si el runner devuelve JSON en stdout
        const trimmed = result.stdout.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
          const jsonResult = JSON.parse(trimmed);
          // Si tiene formato esperado
          if (typeof jsonResult.output === "string") {
            parsedOutput = jsonResult.output;
          }
          if (typeof jsonResult.success === "boolean") {
            parsedSuccess = jsonResult.success;
          }
          if (jsonResult.error) {
            parsedError = parsedError
              ? parsedError + "\n" + jsonResult.error
              : jsonResult.error;
          }
        }
      } catch (e) {
        // No es JSON, usar salida cruda
        // Si falló el parsing, y hay stderr, es probable que sea el error real.
      }

      // Si el exitCode es distinto de 0 y no tuvimos éxito parseando un resultado estructurado
      // es probable que el error real esté en stderr (y no en el JSON).
      if (containerInfo.StatusCode !== 0 && !parsedSuccess) {
        if (!parsedError && result.stderr) {
          parsedError = result.stderr;
        }
      }

      const res = {
        success: parsedSuccess,
        output: parsedOutput.trim(),
        error: parsedError.trim(),
        exitCode: containerInfo.StatusCode,
      };
      return res;
    } catch (error: any) {
      console.error("Docker execution error:", error);
      return {
        success: false,
        output: "",
        error: error.message || "Unknown error",
        exitCode: -1,
      };
    } finally {
      if (container) {
        try {
          await container.remove({ force: true });
        } catch (e: any) {
          console.warn("Error removing container:", e.message);
        }
      }
    }
  }
}
