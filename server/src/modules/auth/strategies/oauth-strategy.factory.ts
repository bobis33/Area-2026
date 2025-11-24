import { Injectable, Type } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import {
  OAuthProvider,
  GitHubProfile,
  DiscordProfile,
  GoogleProfile,
} from '@auth/interfaces/oauth.types';
import { getProviderConfig } from '@auth/config/oauth-providers.config';
import { GenericOAuthStrategy } from '@auth/strategies/oauth.strategy';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as DiscordStrategy } from 'passport-discord';

export function createOAuthStrategy(
  provider: OAuthProvider,
  StrategyClass: any,
  strategyName: string,
): Type<any> {
  @Injectable()
  class GeneratedOAuthStrategy extends PassportStrategy(
    StrategyClass,
    strategyName,
  ) {
    private readonly oauthStrategy: GenericOAuthStrategy;

    constructor(authService: AuthService, configService: ConfigService) {
      super(getProviderConfig(provider, configService));
      this.oauthStrategy = new GenericOAuthStrategy(authService, provider);
    }

    async validate(
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile | DiscordProfile | GoogleProfile,
    ) {
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
