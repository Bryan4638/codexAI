import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Docker, { Container } from 'dockerode';

type Language = 'javascript' | 'python' | 'java' | 'csharp';

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string;
  exitCode: number;
}

@Injectable()
export class DockerManagerService implements OnModuleDestroy {
  private docker: Docker;
  private images: Record<Language, string> = {
    javascript: 'code-platform-js',
    python: 'code-platform-python',
    java: 'code-platform-java',
    csharp: 'code-platform-csharp',
  };

  constructor() {
    this.docker = new Docker();
  }

  async onModuleDestroy() {
    // Cleanup if needed
  }

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
      Cmd: [],
      HostConfig: {
        NetworkMode: 'none',
        Memory: 512 * 1024 * 1024,
        CpuPeriod: 100000,
        CpuQuota: 50000,
        ReadonlyRootfs: false,
        CapDrop: ['ALL'],
        SecurityOpt: ['no-new-privileges:true'],
        Ulimits: [{ Name: 'nofile', Soft: 1024, Hard: 1024 }],
      },
      Env: [
        'PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        'HOME=/tmp',
        'TMPDIR=/tmp',
      ],
      WorkingDir: '/app',
      User: '1000:1000',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      OpenStdin: true,
      StdinOnce: true,
      Tty: false,
    };

    let container: Container | null = null;

    try {
      container = await this.docker.createContainer(containerConfig);
      await container.start();

      const stream = await container.attach({
        stream: true,
        stdin: true,
        stdout: true,
        stderr: true,
        hijack: true,
        logs: true,
      });

      let stdout = '';
      let stderr = '';

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
          stream.on('end', () => resolve({ stdout, stderr }));
          stream.on('error', reject);
        },
      );

      stream.write(code + '\n');
      await new Promise((resolve) => setTimeout(resolve, 100));
      stream.end();

      const waitPromise = container.wait();

      await Promise.race([
        waitPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Execution Timeout')), timeout),
        ),
      ]);

      const result = await Promise.race([
        outputPromise,
        new Promise<{ stdout: string; stderr: string }>((resolve) =>
          setTimeout(() => resolve({ stdout, stderr }), 2000),
        ),
      ]);

      const containerInfo = await waitPromise;

      let parsedOutput = result.stdout;
      let parsedSuccess = containerInfo.StatusCode === 0;
      let parsedError = result.stderr;

      try {
        const trimmed = result.stdout.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          const jsonResult = JSON.parse(trimmed);
          if (typeof jsonResult.output === 'string') {
            parsedOutput = jsonResult.output;
          }
          if (typeof jsonResult.success === 'boolean') {
            parsedSuccess = jsonResult.success;
          }
          if (jsonResult.error) {
            parsedError = parsedError
              ? parsedError + '\n' + jsonResult.error
              : jsonResult.error;
          }
        }
      } catch {
        // No es JSON, usar salida cruda
      }

      if (containerInfo.StatusCode !== 0 && !parsedSuccess) {
        if (!parsedError && result.stderr) {
          parsedError = result.stderr;
        }
      }

      return {
        success: parsedSuccess,
        output: parsedOutput.trim(),
        error: parsedError.trim(),
        exitCode: containerInfo.StatusCode,
      };
    } catch (error: unknown) {
      console.error('Docker execution error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        output: '',
        error: errorMessage,
        exitCode: -1,
      };
    } finally {
      if (container) {
        try {
          await container.remove({ force: true });
        } catch (e: unknown) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          console.warn('Error removing container:', errorMessage);
        }
      }
    }
  }
}
