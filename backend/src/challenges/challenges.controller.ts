import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { GetChallengesDto } from './dto/get-challenges.dto';
import { ChallengesService } from './challenges.service';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los desafíos con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de desafíos obtenida exitosamente',
  })
  getChallenges(@Query() query: GetChallengesDto) {
    return this.challengesService.getChallenges(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Crear nuevo desafío' })
  @ApiResponse({ status: 201, description: 'Desafío creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  createChallenge(@CurrentUser() user: User, @Body() dto: CreateChallengeDto) {
    return this.challengesService.createChallenge(user.id, dto);
  }

  @Post(':id/react')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Alternar reacción en desafío' })
  @ApiResponse({
    status: 200,
    description: 'Reacción actualizada exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  toggleReaction(@CurrentUser() user: User, @Param('id') id: string) {
    return this.challengesService.toggleReaction(user.id, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Eliminar desafío' })
  @ApiResponse({ status: 200, description: 'Desafío eliminado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Desafío no encontrado' })
  deleteChallenge(@CurrentUser() user: User, @Param('id') id: string) {
    return this.challengesService.deleteChallenge(user.id, id);
  }
}
