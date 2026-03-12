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
import { StartLiveCodingDto } from './dto/start-live-coding.dto';
import { SubmitLiveCodingDto } from './dto/submit-live-coding.dto';
import { ChallengesService } from './challenges.service';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt-auth.guard';

@ApiTags('Challenges')
@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todos los desafíos con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de desafíos obtenida exitosamente',
  })
  getChallenges(@Query() query: GetChallengesDto, @CurrentUser() user?: User) {
    return this.challengesService.getChallenges(query, user?.id);
  }

  // ── Live Coding (must be before :id routes) ─────────

  @Post('live-coding/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Iniciar sesión de Live Coding' })
  @ApiResponse({
    status: 201,
    description: 'Sesión de live coding iniciada, reto asignado aleatoriamente',
  })
  startLiveCoding(
    @CurrentUser() user: User,
    @Body() dto: StartLiveCodingDto,
  ) {
    return this.challengesService.startLiveCoding(user.id, dto);
  }

  @Post('live-coding/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Enviar solución de Live Coding' })
  @ApiResponse({
    status: 201,
    description: 'Solución evaluada y puntuación calculada',
  })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  @ApiResponse({ status: 400, description: 'Sesión ya completada' })
  submitLiveCoding(
    @CurrentUser() user: User,
    @Body() dto: SubmitLiveCodingDto,
  ) {
    return this.challengesService.submitLiveCoding(user.id, dto);
  }

  @Get('live-coding/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Obtener historial de Live Coding del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Historial obtenido exitosamente',
  })
  getLiveCodingHistory(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.challengesService.getLiveCodingHistory(user.id, page, limit);
  }

  // ── Param-based routes ──────────────────────────────

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Obtener desafío por ID' })
  @ApiResponse({ status: 200, description: 'Desafío obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Desafío no encontrado' })
  getChallenge(@Param('id') id: string) {
    return this.challengesService.getChallenge(id);
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
