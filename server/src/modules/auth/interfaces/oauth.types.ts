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

export interface DiscordProfile {
  id: string;
  username: string;
  discriminator: string;
  email?: string;
  avatar?: string;
}

export interface GoogleProfile {
  id: string;
  displayName: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
}

export interface GitHubProfile {
  id: string;
  login: string;
  username?: string;
  displayName?: string;
  name?: string;
  emails?: Array<{ value: string; primary?: boolean; verified?: boolean }>;
  avatar_url?: string;
  photos?: Array<{ value: string }>;
}

export function isDiscordProfile(profile: any): profile is DiscordProfile {
  return (
    typeof profile === 'object' &&
    'username' in profile &&
    'discriminator' in profile
  );
}

export function isGoogleProfile(profile: any): profile is GoogleProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    'displayName' in profile &&
    'emails' in profile
  );
}

export function isGitHubProfile(profile: any): profile is GitHubProfile {
  return (
    typeof profile === 'object' &&
    ('login' in profile || 'username' in profile) &&
    'avatar_url' in profile
  );
}
