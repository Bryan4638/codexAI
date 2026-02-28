import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Docker, { Container } from 'dockerode';

type Language = 'javascript' | 'python' | 'java' | 'csharp';

interface ExecutionResult {
  success: boolean;
  output: string;
  error: string;
  exitCode: number;
  returnValue?: any;
}

export interface TestCaseConfig {
  id: string;
  input: string | null;
  expectedOutput: string;
}

export interface TestExecutionResult {
  id: string;
  passed: boolean;
  actual: string;
}

export interface ExecutionWithTestsResult {
  allPassed: boolean;
  testResults: TestExecutionResult[];
  executionTimeMs: number;
  error?: string;
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
      let parsedReturnValue: any = undefined;

      try {
        const trimmed = result.stdout.trim();
        if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
          const jsonResult = JSON.parse(trimmed);
          if (jsonResult.result !== undefined) {
            parsedReturnValue = jsonResult.result;
          }
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
        returnValue: parsedReturnValue,
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
        returnValue: undefined,
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

  async executeWithTests(
    language: Language,
    code: string,
    tests: TestCaseConfig[],
    timeout: number = 15000,
  ): Promise<ExecutionWithTestsResult> {
    if (language !== 'javascript') {
      return {
        allPassed: false,
        testResults: [],
        executionTimeMs: 0,
        error: `Ejecución con tests aún no soportada para ${language}`,
      };
    }

    // Buscamos el nombre de la función en el código del usuario (regex simple para function o const)
    let functionName = 'main';
    const funcMatch = code.match(
      /(?:function|const|let|var)\s+([a-zA-Z0-9_]+)\s*(?:=|\()/,
    );
    if (funcMatch && funcMatch[1]) {
      functionName = funcMatch[1];
    }

    const scriptRunner = `
      // --- Código del usuario ---
      ${code}

      // --- Runner ---
      const __tests = ${JSON.stringify(tests)};
      let __finalResults = [];
      let __minMs = Infinity;
      
      const __getNow = () => typeof performance !== 'undefined' ? performance.now() : Date.now();
      
      // Correr los tests 5 veces para estabilizar el tiempo (warmup V8 y evitar garbage collector pikes)
      for (let run = 0; run < 5; run++) {
        const __results = [];
        const __start = __getNow();
        
        for (const t of __tests) {
          try {
            const args = typeof t.input === 'string' && t.input.trim().startsWith('[') 
              ? JSON.parse(t.input) 
              : (t.input ? [t.input] : []);
              
            const actual = String(${functionName}(...args));
            __results.push({ id: t.id, passed: actual === t.expectedOutput, actual });
          } catch(e) {
            __results.push({ id: t.id, passed: false, actual: 'ERROR: ' + e.message });
          }
        }
        
        const __ms = __getNow() - __start;
        if (__ms < __minMs) {
          __minMs = __ms;
        }
        // Guardamos las respuestas de la última pasada (deberían ser todas iguales)
        if (run === 4) {
          __finalResults = __results;
        }
      }
      
      const __cleanMs = Number(__minMs.toFixed(3));
      
      // Retornar objeto final al sandbox para que lo serialice en "result"
      ({ results: __finalResults, executionTimeMs: __cleanMs });
    `;

    const result = await this.executeCode(language, scriptRunner, timeout);

    if (result.exitCode !== 0 || result.error) {
      return {
        allPassed: false,
        testResults: [],
        executionTimeMs: 0,
        error: result.error || 'Execution failed',
      };
    }

    try {
      const parsed = result.returnValue;
      if (!parsed || !parsed.results) {
        throw new Error('Test results not found in evaluation returned object');
      }

      const testResults = parsed.results as TestExecutionResult[];
      const allPassed = testResults.every((t) => t.passed);

      return {
        allPassed,
        testResults,
        executionTimeMs: parsed.executionTimeMs,
      };
    } catch (e: unknown) {
      return {
        allPassed: false,
        testResults: [],
        executionTimeMs: 0,
        error: `Failed to parse runner output: ${result.output}`,
      };
    }
  }
}
