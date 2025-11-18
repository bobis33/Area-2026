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

export interface DiscordRawProfile {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  email?: string;
  verified?: boolean;
  locale?: string;
  mfa_enabled?: boolean;
  flags?: number;
  premium_type?: number;
}

export interface GoogleRawProfile {
  id: string;
  displayName: string;
  name?: {
    givenName?: string;
    familyName?: string;
  };
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
  _json?: any;
}

export interface GitHubRawProfile {
  id: string;
  username?: string;
  login?: string;
  displayName?: string;
  name?: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
  avatar_url?: string;
  _json?: any;
}

export type RawOAuthProfile =
  | DiscordRawProfile
  | GoogleRawProfile
  | GitHubRawProfile;

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface OAuthData {
  profile: NormalizedOAuthProfile;
  tokens: OAuthTokens;
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

export interface ProviderStrategyConfig {
  name: OAuthProvider;
  strategyClass: any;
  config: OAuthProviderConfig;
}

export interface ProfileNormalizationOptions {
  provider: OAuthProvider;
  requireEmail?: boolean;
  defaultAvatar?: string;
}

export function isDiscordProfile(profile: any): profile is DiscordRawProfile {
  return (
    typeof profile === 'object' &&
    'username' in profile &&
    'discriminator' in profile
  );
}

export function isGoogleProfile(profile: any): profile is GoogleRawProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
    'displayName' in profile &&
    'emails' in profile
  );
}

export function isGitHubProfile(profile: any): profile is GitHubRawProfile {
  return (
    typeof profile === 'object' &&
    ('login' in profile || 'username' in profile) &&
    'avatar_url' in profile
  );
}
