import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueManagerService } from '../services/queue-manager.service';
import { ExecuteWithTestsDto } from '../dto/execute-with-tests.dto';
import { ExerciseTest } from '../../exercises/entities/exercise-test.entity';

@Injectable()
export class ExecuteWithTestsUseCase {
  constructor(
    private readonly queueManager: QueueManagerService,
    @InjectRepository(ExerciseTest)
    private readonly exerciseTestRepo: Repository<ExerciseTest>,
  ) {}

  async execute(dto: ExecuteWithTestsDto) {
    const { exerciseId, language, code, userId } = dto;

    // Obtener tests del ejercicio
    const tests = await this.exerciseTestRepo.find({
      where: { exercise: { id: exerciseId } },
      order: { order: 'ASC' },
    });

    if (!tests || tests.length === 0) {
      throw new NotFoundException(`No tests found for exercise ${exerciseId}`);
    }

    // Mapear tests al formato TestCaseConfig
    const testCases = tests.map((t) => ({
      id: t.id,
      input: t.input,
      expectedOutput: t.expectedOutput,
    }));

    // Agregar trabajo a la cola con los tests
    const job = await this.queueManager.addJob({
      language,
      code,
      userId,
      timeout: 15000,
      tests: testCases,
    });

    try {
      const result = await job.finished();

      if (result && typeof result === 'object' && 'testResults' in result) {
        // Filtrar tests ocultos para no retornar resultados individuales al frontend
        // pero sí mantener el estado global allPassed
        const publicResults = result.testResults.filter((tr: any) => {
          const originalTest = tests.find((t) => t.id === tr.id);
          return originalTest && !originalTest.isHidden;
        });

        // Asegurar que el executionTimeMs sea un número válido y extraerlo
        const timeMs =
          typeof result.executionTimeMs === 'number'
            ? result.executionTimeMs
            : 0;

        return {
          allPassed: result.allPassed,
          testResults: publicResults,
          executionTimeMs: timeMs,
          error: result.error,
        };
      }

      return result;
    } catch (jobError: unknown) {
      console.error(`Job ${job.id} execution with tests failed:`, jobError);
      return {
        allPassed: false,
        testResults: [],
        executionTimeMs: 0,
        error:
          jobError instanceof Error ? jobError.message : 'Execution failed',
      };
    }
  }
}
