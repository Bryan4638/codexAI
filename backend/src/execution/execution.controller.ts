import { Controller, Post, Body } from '@nestjs/common';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ExecuteCodeUseCase } from './use-cases/execute-code.use-case';

@Controller('execute')
export class ExecutionController {
  constructor(private readonly executeCodeUseCase: ExecuteCodeUseCase) {}

  @Post()
  executeCode(@Body() dto: ExecuteCodeDto) {
    return this.executeCodeUseCase.execute(dto);
  }
}
