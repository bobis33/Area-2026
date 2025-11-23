import { AuthService } from '../auth.service';
import {
  OAuthProvider,
  OAuthTokens,
  OAuthValidationResult,
} from '../interfaces/oauth.types';
import { normalizeOAuthProfile } from '../config/oauth-providers.config';

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
