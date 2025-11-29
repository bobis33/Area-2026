import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { AuthService } from '@auth/auth.service';
import { GitHubProfile } from '@auth/interfaces/oauth.types';
import { GenericOAuthStrategy } from '@auth/strategies/oauth.strategy';
import { OAuthProvider } from '@auth/interfaces/oauth.types';

@Injectable()
export class GithubOAuthStrategy extends PassportStrategy(
  GitHubStrategy,
  'github',
) {
  private readonly oauthStrategy: GenericOAuthStrategy;

  constructor(authService: AuthService, configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('GITHUB_CLIENT_CALLBACK_URL') ||
        'http://localhost:8080/auth/github/callback',
      scope: ['user:email'],
    });
    this.oauthStrategy = new GenericOAuthStrategy(
      authService,
      OAuthProvider.GITHUB,
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile,
  ) {
    return this.oauthStrategy.validate(accessToken, refreshToken, profile);
  }
}

