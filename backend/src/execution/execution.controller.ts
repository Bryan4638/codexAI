import { Controller, Post, Body } from '@nestjs/common';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ExecuteWithTestsDto } from './dto/execute-with-tests.dto';
import { ExecuteCodeUseCase } from './use-cases/execute-code.use-case';
import { ExecuteWithTestsUseCase } from './use-cases/execute-with-tests.use-case';

@Controller('execute')
export class ExecutionController {
  constructor(
    private readonly executeCodeUseCase: ExecuteCodeUseCase,
    private readonly executeWithTestsUseCase: ExecuteWithTestsUseCase,
  ) {}

  @Post()
  executeCode(@Body() dto: ExecuteCodeDto) {
    return this.executeCodeUseCase.execute(dto);
  }

  @Post('with-tests')
  executeWithTests(@Body() dto: ExecuteWithTestsDto) {
    return this.executeWithTestsUseCase.execute(dto);
  }
}
