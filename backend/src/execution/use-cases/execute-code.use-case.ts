import { Injectable } from '@nestjs/common';
import { QueueManagerService } from '../services/queue-manager.service';
import { ExecuteCodeDto } from '../dto/execute-code.dto';

@Injectable()
export class ExecuteCodeUseCase {
  constructor(private readonly queueManager: QueueManagerService) {}

  async execute(dto: ExecuteCodeDto) {
    const { language, code, userId } = dto;

    // Agregar trabajo a la cola
    const job = await this.queueManager.addJob({
      language,
      code,
      userId,
      timeout: 10000,
    });

    console.log(
      `Job ${job.id} added to queue for user ${userId || 'anonymous'}`,
    );

    try {
      const result = await job.finished();

      // Intentar parsear el output si es JSON
      if (result && typeof result === 'object' && 'output' in result) {
        try {
          const jsonMatch = (result.output as string).match(/\{.*\}/s);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              ...parsed,
              executionTime: 'N/A',
              exitCode: result.exitCode,
            };
          }
        } catch {
          // Ignore parse error
        }
      }

      return result;
    } catch (jobError: unknown) {
      console.error(`Job ${job.id} execution failed:`, jobError);
      const errorMessage =
        jobError instanceof Error
          ? jobError.message
          : 'Execution failed in worker';
      return {
        success: false,
        error: errorMessage,
        exitCode: -1,
      };
    }
  }
}
