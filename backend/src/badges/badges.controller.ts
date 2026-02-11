import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { BadgesService } from './badges.service';

@ApiTags('Badges')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las insignias disponibles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de insignias obtenida exitosamente',
  })
  getAllBadges() {
    return this.badgesService.getAllBadges();
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Obtener insignias del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Insignias del usuario obtenidas exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getUserBadges(@CurrentUser() user: User) {
    return this.badgesService.getUserBadges(user.id);
  }

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Obtener progreso del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Progreso del usuario obtenido exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getUserProgress(@CurrentUser() user: User) {
    return this.badgesService.getUserProgress(user.id);
  }
}
