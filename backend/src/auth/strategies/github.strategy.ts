import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { env } from '../../config/env';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: env.GITHUB_CLIENT_ID || 'mock_client_id',
      clientSecret: env.GITHUB_CLIENT_SECRET || 'mock_secret',
      callbackURL:
        env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const { emails, photos, id } = profile;
    const user = await this.authService.validateOAuthUser({
      email: emails?.[0]?.value,
      avatar: photos?.[0]?.value,
      provider: 'github',
      providerId: id,
    });
    done(null, user);
  }
}
