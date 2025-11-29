import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthService } from '@auth/auth.service';
import { GoogleProfile } from '@auth/interfaces/oauth.types';
import { GenericOAuthStrategy } from '@auth/strategies/oauth.strategy';
import { OAuthProvider } from '@auth/interfaces/oauth.types';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  private readonly oauthStrategy: GenericOAuthStrategy;

  constructor(authService: AuthService, configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL') ||
        'http://localhost:8080/auth/google/callback',
      scope: ['profile', 'email'],
    });
    this.oauthStrategy = new GenericOAuthStrategy(
      authService,
      OAuthProvider.GOOGLE,
    );
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
  ) {
    return this.oauthStrategy.validate(accessToken, refreshToken, profile);
  }
}

