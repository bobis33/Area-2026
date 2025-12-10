import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { OAuthProvider } from '@auth/interfaces/oauth.types';
import { normalizeOAuthProfile } from '@auth/config/oauth-providers.config';

@Injectable()
export class GenericOAuthStrategy {
  constructor(
    private readonly authService: AuthService,
    private readonly provider: OAuthProvider,
  ) {}

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    try {
      const normalizedUser = normalizeOAuthProfile(profile, this.provider);

      const user = await this.authService.validateOAuthLogin(normalizedUser, {
        accessToken,
        refreshToken,
      });

      if (!user) {
        throw new UnauthorizedException(
          'Authentication failed: No user returned',
        );
      }

      return user;
    } catch (error) {
      console.error('Error');
    }
  }
}
