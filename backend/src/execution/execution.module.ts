import { Module } from '@nestjs/common';
import { ExecutionController } from './execution.controller';
import { DockerManagerService } from './services/docker-manager.service';
import { QueueManagerService } from './services/queue-manager.service';
import { ExecuteCodeUseCase } from './use-cases/execute-code.use-case';

@Module({
  controllers: [ExecutionController],
  providers: [DockerManagerService, QueueManagerService, ExecuteCodeUseCase],
})
export class ExecutionModule {}
