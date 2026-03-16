import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ExecuteCodeDto } from './dto/execute-code.dto';
import { ExecuteWithTestsDto } from './dto/execute-with-tests.dto';
import { ExecuteCodeUseCase } from './use-cases/execute-code.use-case';
import { ExecuteWithTestsUseCase } from './use-cases/execute-with-tests.use-case';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('Execution (Sandbox)')
@Controller('execute')
export class ExecutionController {
  constructor(
    private readonly executeCodeUseCase: ExecuteCodeUseCase,
    private readonly executeWithTestsUseCase: ExecuteWithTestsUseCase,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Ejecutar código libremente',
    description:
      'Envía código a Docker para ser ejecutado retornando la salida de consola directa.',
  })
  @ApiResponse({ status: 201, description: 'Código ejecutado exitosamente.' })
  executeCode(@Body() dto: ExecuteCodeDto) {
    return this.executeCodeUseCase.execute(dto);
  }

  @Post('with-tests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({
    summary: 'Ejecutar código contra Tests',
    description:
      'Ejecuta el código en Docker evaluándolo contra los tests visibles y ocultos de la base de datos.',
  })
  @ApiResponse({ status: 201, description: 'Tests evaluados y respondidos.' })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron tests para el ID proveído.',
  })
  executeWithTests(
    @CurrentUser() user: User,
    @Body() dto: ExecuteWithTestsDto,
  ) {
    return this.executeWithTestsUseCase.execute(user.id, dto);
  }
}
