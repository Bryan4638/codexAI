import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { LeaderboardService } from './leaderboard.service';

@ApiTags('Leaderboard')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Obtener tabla de clasificación con paginación' })
  @ApiResponse({
    status: 200,
    description: 'Tabla de clasificación obtenida exitosamente',
  })
  getLeaderboard(
    @Query() query: GetLeaderboardDto,
    @CurrentUser() user?: User,
  ) {
    return this.leaderboardService.getLeaderboard(query, user?.id);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Obtener perfil de usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Perfil de usuario obtenido exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getUserProfile(@Param('userId') userId: string) {
    return this.leaderboardService.getUserProfile(userId);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.leaderboardService.updateProfile(user.id, dto);
  }
}
