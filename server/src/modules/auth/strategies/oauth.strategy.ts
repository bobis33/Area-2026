import { AuthService } from '@auth/auth.service';
import {
  OAuthProvider,
  OAuthTokens,
  OAuthValidationResult,
  GitHubProfile,
  GoogleProfile,
  DiscordProfile,
} from '@auth/interfaces/oauth.types';
import { normalizeOAuthProfile } from '@auth/config/oauth-providers.config';

export class GenericOAuthStrategy {
  constructor(
    protected readonly authService: AuthService,
    protected readonly provider: OAuthProvider,
  ) {}

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GitHubProfile | GoogleProfile | DiscordProfile,
  ): Promise<OAuthValidationResult> {
    try {
      const normalizedProfile = normalizeOAuthProfile(profile, this.provider);
      const tokens: OAuthTokens = { accessToken, refreshToken };
      return await this.authService.validateOAuthLogin(
        normalizedProfile,
        tokens,
      );
    } catch (error) {
      console.error(`OAuth validation error (${this.provider}):`, error);
      return null;
    }
  }
}
