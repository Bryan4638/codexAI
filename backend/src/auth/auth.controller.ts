import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { EmailRequestDto } from './dto/email-request.dto';
import { EmailVerifyDto } from './dto/email-verify.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Iniciar autenticación con Google OAuth' })
  @ApiResponse({
    status: 302,
    description: 'Redirige a Google para autenticación',
  })
  async googleAuth() {
    // Initiates Google OAuth
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiResponse({ status: 302, description: 'Redirige al frontend con tokens' })
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = req.user;
    res.redirect(
      `http://localhost:5173?token=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Iniciar autenticación con GitHub OAuth' })
  @ApiResponse({
    status: 302,
    description: 'Redirige a GitHub para autenticación',
  })
  async githubAuth() {
    // Initiates GitHub OAuth
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Callback de GitHub OAuth' })
  @ApiResponse({ status: 302, description: 'Redirige al frontend con tokens' })
  async githubAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = req.user;
    res.redirect(
      `http://localhost:5173?token=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Post('email/request')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @ApiOperation({ summary: 'Solicitar código OTP por email' })
  @ApiResponse({ status: 200, description: 'Código enviado exitosamente' })
  @ApiResponse({ status: 429, description: 'Demasiadas solicitudes' })
  async requestEmailCode(@Body() dto: EmailRequestDto) {
    return this.authService.requestEmailCode(dto.email);
  }

  @Post('email/verify')
  @ApiOperation({ summary: 'Verificar código OTP y obtener tokens' })
  @ApiResponse({
    status: 200,
    description: 'Código verificado, tokens generados',
  })
  @ApiResponse({ status: 400, description: 'Código inválido o expirado' })
  async verifyEmailCode(@Body() dto: EmailVerifyDto) {
    return this.authService.verifyEmailCode(dto.email, dto.code);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Nuevo access token generado' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Información del usuario obtenida exitosamente',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
