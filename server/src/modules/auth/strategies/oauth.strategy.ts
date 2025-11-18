import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import {
  OAuthProvider,
  OAuthTokens,
  OAuthValidationResult,
} from '../interfaces/oauth.types';
import {
  getProviderConfig,
  normalizeOAuthProfile,
} from '../config/oauth-providers.config';

export class GenericOAuthStrategy {
  constructor(
    protected readonly authService: AuthService,
    protected readonly provider: OAuthProvider,
  ) {}

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<OAuthValidationResult> {
    try {
      const normalizedProfile = normalizeOAuthProfile(profile, this.provider);
      const tokens: OAuthTokens = { accessToken, refreshToken };
      return await this.authService.validateOAuthLogin(
        normalizedProfile,
        tokens,
      );
    } catch (error) {
      console.error(
        `[${this.provider.toUpperCase()} OAuth] Validation error:`,
        error,
      );
      return null;
    }
  }
}

@Injectable()
export class DiscordOAuthStrategy extends PassportStrategy(
  DiscordStrategy,
  'discord',
) {
  private readonly oauthStrategy: GenericOAuthStrategy;

  constructor(authService: AuthService, configService: ConfigService) {
    super(getProviderConfig(OAuthProvider.DISCORD, configService));
    this.oauthStrategy = new GenericOAuthStrategy(
      authService,
      OAuthProvider.DISCORD,
    );
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.oauthStrategy.validate(accessToken, refreshToken, profile);
  }
}

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  private readonly oauthStrategy: GenericOAuthStrategy;

  constructor(authService: AuthService, configService: ConfigService) {
    super(getProviderConfig(OAuthProvider.GOOGLE, configService));
    this.oauthStrategy = new GenericOAuthStrategy(
      authService,
      OAuthProvider.GOOGLE,
    );
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.oauthStrategy.validate(accessToken, refreshToken, profile);
  }
}

@Injectable()
export class GitHubOAuthStrategy extends PassportStrategy(
  GitHubStrategy,
  'github',
) {
  private readonly oauthStrategy: GenericOAuthStrategy;

  constructor(authService: AuthService, configService: ConfigService) {
    super(getProviderConfig(OAuthProvider.GITHUB, configService));
    this.oauthStrategy = new GenericOAuthStrategy(
      authService,
      OAuthProvider.GITHUB,
    );
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.oauthStrategy.validate(accessToken, refreshToken, profile);
  }
}
