import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { UserProgress } from './entities/user-progress.entity';
import { UserBadge } from './entities/user-badge.entity';
import { RegisterUserUseCase } from './use-cases/register-user.use-case';
import { LoginUserUseCase } from './use-cases/login-user.use-case';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProgress, UserBadge]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'codex-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    GetCurrentUserUseCase,
    JwtStrategy,
  ],
  exports: [TypeOrmModule, JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
