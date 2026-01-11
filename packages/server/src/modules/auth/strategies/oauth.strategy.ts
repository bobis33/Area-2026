import { AuthService } from '@modules/auth/auth.service';
import { OAuthProvider } from '@interfaces/oauth.interface';
import { normalizeOAuthProfile } from '@modules/auth/config/oauth-providers.config';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GenericOAuthStrategy {
  private readonly logger = new Logger(GenericOAuthStrategy.name);
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
      this.logger.error(`[OAuth Strategy] validate error occurred.`);
      throw error;
    }
  }
}
