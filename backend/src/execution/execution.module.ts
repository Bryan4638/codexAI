import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutionController } from './execution.controller';
import { DockerManagerService } from './services/docker-manager.service';
import { QueueManagerService } from './services/queue-manager.service';
import { ExecuteCodeUseCase } from './use-cases/execute-code.use-case';
import { ExecuteWithTestsUseCase } from './use-cases/execute-with-tests.use-case';
import { ExerciseTest } from '../exercises/entities/exercise-test.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExerciseTest])],
  controllers: [ExecutionController],
  providers: [
    DockerManagerService,
    QueueManagerService,
    ExecuteCodeUseCase,
    ExecuteWithTestsUseCase,
  ],
})
export class ExecutionModule {}
