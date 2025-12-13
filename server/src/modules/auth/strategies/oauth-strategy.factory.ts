import { Injectable, Type } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';
import {
  OAuthProvider,
  GitHubProfile,
  DiscordProfile,
  GoogleProfile,
  SpotifyProfile,
  GitLabProfile,
} from '@/interfaces/oauth';
import { getProviderConfig } from '@modules/auth/config/oauth-providers.config';
import { GenericOAuthStrategy } from '@modules/auth/strategies/oauth.strategy';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { Strategy as GitLabStrategy } from 'passport-gitlab2';

export function createOAuthStrategy(
  provider: OAuthProvider,
  StrategyClass: any,
  strategyName: string,
): Type {
  @Injectable()
  class GeneratedOAuthStrategy extends PassportStrategy(
    StrategyClass,
    strategyName,
  ) {
    private readonly oauthStrategy: GenericOAuthStrategy;

    constructor(authService: AuthService, configService: ConfigService) {
      const providerConfig = getProviderConfig(provider, configService);
      super(providerConfig);
      this.oauthStrategy = new GenericOAuthStrategy(authService, provider);
    }

    async validate(
      accessToken: string,
      refreshToken: string,
      profile:
        | GitHubProfile
        | DiscordProfile
        | GoogleProfile
        | SpotifyProfile
        | GitLabProfile,
    ): Promise<any> {
      return this.oauthStrategy.validate(accessToken, refreshToken, profile);
    }
  }

  Object.defineProperty(GeneratedOAuthStrategy, 'name', {
    value: `${strategyName[0].toUpperCase() + strategyName.slice(1)}OAuthStrategy`,
  });

  return GeneratedOAuthStrategy;
}

export const DiscordOAuthStrategy = createOAuthStrategy(
  OAuthProvider.DISCORD,
  DiscordStrategy,
  'discord',
);

export const GoogleOAuthStrategy = createOAuthStrategy(
  OAuthProvider.GOOGLE,
  GoogleStrategy,
  'google',
);

export const GitHubOAuthStrategy = createOAuthStrategy(
  OAuthProvider.GITHUB,
  GitHubStrategy,
  'github',
);

export const SpotifyOAuthStrategy = createOAuthStrategy(
  OAuthProvider.SPOTIFY,
  SpotifyStrategy,
  'spotify',
);

export const GitLabOAuthStrategy = createOAuthStrategy(
  OAuthProvider.GITLAB,
  GitLabStrategy,
  'gitlab',
);
