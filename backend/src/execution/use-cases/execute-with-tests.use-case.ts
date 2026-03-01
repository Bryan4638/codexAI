import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QueueManagerService } from '../services/queue-manager.service';
import { ExecuteWithTestsDto } from '../dto/execute-with-tests.dto';
import { ChallengeTest } from '../../challenges/entities/challenge-test.entity';
import { UserChallengeProgress } from '../../challenges/entities/user-challenge-progress.entity';

@Injectable()
export class ExecuteWithTestsUseCase {
  constructor(
    private readonly queueManager: QueueManagerService,
    @InjectRepository(ChallengeTest)
    private readonly challengeTestRepo: Repository<ChallengeTest>,
    @InjectRepository(UserChallengeProgress)
    private readonly userProgressRepo: Repository<UserChallengeProgress>,
  ) {}

  async execute(dto: ExecuteWithTestsDto) {
    const { challengeId, language, code, userId } = dto;

    // Obtener tests del reto
    const tests = await this.challengeTestRepo.find({
      where: { challenge: { id: challengeId } },
      order: { order: 'ASC' },
    });

    if (!tests || tests.length === 0) {
      throw new NotFoundException(
        `No tests found for challenge ${challengeId}`,
      );
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

        // Guardar progreso y mejor tiempo si el código pasó y si hay un usuario logueado
        if (result.allPassed && userId) {
          try {
            const progress = await this.userProgressRepo.findOne({
              where: { user: { id: userId }, challenge: { id: challengeId } },
            });

            if (progress) {
              if (
                progress.bestExecutionTimeMs === null ||
                progress.bestExecutionTimeMs === undefined ||
                timeMs < Number(progress.bestExecutionTimeMs)
              ) {
                progress.bestExecutionTimeMs = timeMs;
                await this.userProgressRepo.save(progress);
              }
            } else {
              // Si no existe progreso, inicializar uno nuevo y registrar el mejor tiempo de paso
              const newProgress = this.userProgressRepo.create({
                user: { id: userId },
                challenge: { id: challengeId },
                bestExecutionTimeMs: timeMs,
              });
              await this.userProgressRepo.save(newProgress);
            }
          } catch (e) {
            console.error('Error saving best execution time:', e);
          }
        }

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
