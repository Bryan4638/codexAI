import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExecutionController } from './execution.controller';
import { DockerManagerService } from './services/docker-manager.service';
import { QueueManagerService } from './services/queue-manager.service';
import { ExecuteCodeUseCase } from './use-cases/execute-code.use-case';
import { ExecuteWithTestsUseCase } from './use-cases/execute-with-tests.use-case';
import { ChallengeTest } from '../challenges/entities/challenge-test.entity';
import { UserChallengeProgress } from '../challenges/entities/user-challenge-progress.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeTest, UserChallengeProgress])],
  controllers: [ExecutionController],
  providers: [
    DockerManagerService,
    QueueManagerService,
    ExecuteCodeUseCase,
    ExecuteWithTestsUseCase,
  ],
})
export class ExecutionModule {}
