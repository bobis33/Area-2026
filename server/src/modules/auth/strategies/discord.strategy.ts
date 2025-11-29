import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { AuthService } from '@auth/auth.service';
import { DiscordProfile } from '@auth/interfaces/oauth.types';
import { GenericOAuthStrategy } from '@auth/strategies/oauth.strategy';
import { OAuthProvider } from '@auth/interfaces/oauth.types';

@Injectable()
export class DiscordOAuthStrategy extends PassportStrategy(
  DiscordStrategy,
  'discord',
) {
  private readonly oauthStrategy: GenericOAuthStrategy;

  constructor(authService: AuthService, configService: ConfigService) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID') || '',
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('DISCORD_CLIENT_CALLBACK_URL') ||
        'http://localhost:8080/auth/discord/callback',
      scope: ['identify', 'email'],
    });
    this.oauthStrategy = new GenericOAuthStrategy(
      authService,
      OAuthProvider.DISCORD,
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: DiscordProfile,
  ) {
    return this.oauthStrategy.validate(accessToken, refreshToken, profile);
  }
}

