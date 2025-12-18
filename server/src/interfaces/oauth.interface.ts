import { AuthenticatedUser } from '@interfaces/user.interface';

export enum OAuthProvider {
  DISCORD = 'discord',
  GOOGLE = 'google',
  GITHUB = 'github',
  SPOTIFY = 'spotify',
  GITLAB = 'gitlab',
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
  provider_id: string;
  raw: any;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
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
  id?: string | number;
  node_id?: string;
  displayName?: string;
  username?: string;
  login?: string;

  emails?: Array<{ value: string; primary?: boolean; verified?: boolean }>;
  photos?: Array<{ value: string }>;
  avatar_url?: string;

  _json?: {
    id?: number | string;
    node_id?: string;
    login?: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface SpotifyProfile {
  id: string;
  display_name: string;
  email?: string;
  images?: Array<{ url: string }>;
}

export interface GitLabProfile {
  id: string;
  username: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}
