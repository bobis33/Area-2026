export enum OAuthProvider {
  DISCORD = 'discord',
  GOOGLE = 'google',
  GITHUB = 'github',
}

export interface OAuthProviderConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  scope: string[];
}

export interface NormalizedOAuthProfile {
  id: string;
  email: string;
  username?: string;
  displayName: string;
  avatar?: string;
  provider: OAuthProvider;
  providerId: string;
  raw: any;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  provider: string;
  providerId: string;
  role: string;
  createdAt: Date;
}

export type OAuthValidationResult = AuthenticatedUser | null;

export function isDiscordProfile(profile: any): profile is any {
  return (
    typeof profile === 'object' &&
    'username' in profile &&
    'discriminator' in profile
  );
}

export function isGoogleProfile(profile: any): profile is any {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    'displayName' in profile &&
    'emails' in profile
  );
}

export function isGitHubProfile(profile: any): profile is any {
  return (
    typeof profile === 'object' &&
    ('login' in profile || 'username' in profile) &&
    'avatar_url' in profile
  );
}
