import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { env } from '../../config/env';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: env.GOOGLE_CLIENT_ID || 'mock_client_id',
      clientSecret: env.GOOGLE_CLIENT_SECRET || 'mock_secret',
      callbackURL:
        env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = await this.authService.validateOAuthUser({
      email: emails[0].value,
      avatar: photos[0].value,
      provider: 'google',
      providerId: id,
    });
    done(null, user);
  }
}
