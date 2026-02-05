import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Queue from 'bull';
import { DockerManagerService } from './docker-manager.service';

interface ExecutionJob {
  language: 'javascript' | 'python' | 'java' | 'csharp';
  code: string;
  userId?: string;
  timeout?: number;
}

@Injectable()
export class QueueManagerService implements OnModuleDestroy {
  private queue: Queue.Queue<ExecutionJob>;

  constructor(private readonly dockerManager: DockerManagerService) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    this.queue = new Queue('execution-queue', redisUrl, {
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 100,
        attempts: 1,
      },
    });

    this.initializeWorker();
  }

  async onModuleDestroy() {
    await this.queue.close();
  }

  private initializeWorker() {
    console.log('👷 Initializing Queue Worker...');

    this.queue.process(5, async (job) => {
      const { language, code, userId, timeout } = job.data;

      console.log(
        `Job ${job.id}: Processing ${language} execution for user ${userId || 'anonymous'}`,
      );

      try {
        const result = await this.dockerManager.executeCode(
          language,
          code,
          timeout,
        );
        return result;
      } catch (error: unknown) {
        console.error(`Job ${job.id} failed:`, error);
        throw error;
      }
    });

    this.queue.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    this.queue.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed with error ${err.message}`);
    });
  }

  public async addJob(data: ExecutionJob): Promise<Queue.Job<ExecutionJob>> {
    return this.queue.add(data);
  }
}
