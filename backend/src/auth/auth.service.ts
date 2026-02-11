import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { EmailCode } from './entities/email-code.entity';
import * as bcrypt from 'bcrypt';
import { authenticator } from './utils/otp.config';
import { randomUUID } from 'crypto';

// Native date helpers
const addMinutesNative = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60000);
const addDaysNative = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    @InjectRepository(EmailCode)
    private readonly emailRepo: Repository<EmailCode>,
    private readonly jwt: JwtService,
  ) {}

  /** Validación OAuth Google/GitHub */
  async validateOAuthUser(profile: {
    email: string;
    avatar: string;
    provider: 'google' | 'github';
    providerId: string;
  }) {
    let user = await this.userRepo.findOne({ where: { email: profile.email } });

    if (!user) {
      // Guardamos directamente con save, sin usar create(), evitando cascadas innecesarias
      user = await this.userRepo.save({
        email: profile.email,
        authProvider: profile.provider,
        providerId: profile.providerId,
        avatar: profile.avatar,
        avatarUrl: profile.avatar,
        username: `user_${randomUUID().split('-')[0]}`,
      });
    } else {
      // Solo actualizar campos que hayan cambiado
      const updateData: Partial<
        Pick<User, 'authProvider' | 'providerId' | 'avatar' | 'avatarUrl'>
      > = {};

      if (user.authProvider !== profile.provider) {
        updateData.authProvider = profile.provider;
      }
      if (user.providerId !== profile.providerId) {
        updateData.providerId = profile.providerId;
      }
      if (user.avatar !== profile.avatar) {
        updateData.avatar = profile.avatar;
        updateData.avatarUrl = profile.avatar;
      }

      if (Object.keys(updateData).length > 0) {
        await this.userRepo.update(user.id, updateData);
        Object.assign(user, updateData); // reflejar cambios en el objeto local
      }
    }

    return this.generateTokens(user);
  }

  /** Solicitar código OTP por correo */
  async requestEmailCode(email: string) {
    const secret = authenticator.generateSecret();
    const code = await authenticator.generate({ secret });
    const codeHash = await bcrypt.hash(code, 10);

    await this.emailRepo.save({
      email,
      codeHash,
      expiresAt: addMinutesNative(new Date(), 5),
    });

    console.log(`[DEV] OTP for ${email}: ${code}`);
    return { message: 'Code sent (check logs for dev)' };
  }

  /** Verificar código OTP */
  async verifyEmailCode(email: string, code: string) {
    const record = await this.emailRepo.findOne({
      where: { email, used: false },
      order: { createdAt: 'DESC' },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    const isValid = await bcrypt.compare(code, record.codeHash);
    if (!isValid) throw new UnauthorizedException('Invalid code');

    record.used = true;
    await this.emailRepo.save(record);

    let user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      user = await this.userRepo.save({
        email,
        authProvider: 'email',
        username: `user_${randomUUID().split('-')[0]}`,
      });
    }

    return this.generateTokens(user);
  }

  /** Generar access + refresh tokens */
  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwt.sign(payload);

    // Refresh token: id + random
    const refreshId = randomUUID();
    const rawToken = randomUUID();
    const refreshToken = `${refreshId}.${rawToken}`;

    await this.refreshRepo.save({
      id: refreshId,
      user: { id: user.id },
      tokenHash: await bcrypt.hash(rawToken, 10),
      expiresAt: addDaysNative(new Date(), 30),
    });

    return { accessToken, refreshToken };
  }

  /** Refresh token eficiente */
  async refresh(token: string) {
    const [tokenId, rawToken] = token.split('.');

    if (!tokenId || !rawToken)
      throw new UnauthorizedException('Invalid refresh token');

    const stored = await this.refreshRepo.findOne({
      where: { id: tokenId },
      relations: ['user'],
    });

    if (!stored) throw new UnauthorizedException('Invalid refresh token');

    const valid = await bcrypt.compare(rawToken, stored.tokenHash);
    if (!valid) throw new UnauthorizedException('Invalid refresh token');

    if (stored.expiresAt < new Date()) {
      await this.refreshRepo.delete(stored.id);
      throw new UnauthorizedException('Expired refresh token');
    }

    // Rotación: borrar usado y generar nuevo
    await this.refreshRepo.delete(stored.id);
    return this.generateTokens(stored.user);
  }
}
