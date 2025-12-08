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

export interface AuthenticatedUser {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  provider: string;
  provider_id: string;
  role: string;
  created_at: Date;
  updated_at: Date;
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

export function isDiscordProfile(profile: any): profile is DiscordProfile {
  return (
    typeof profile === 'object' &&
    profile !== null &&
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
  if (typeof profile !== 'object' || profile === null) {
    return false;
  }

  // Vérifier si l'ID existe (dans profile ou dans _json)
  const hasIdInRoot = 'id' in profile;
  const hasJsonObject =
    '_json' in profile &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof profile._json === 'object' &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    profile._json !== null;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const hasIdInJson = hasJsonObject && 'id' in profile._json;

  const hasId = hasIdInRoot || hasIdInJson;

  if (!hasId) {
    return false;
  }

  // Vérifier si login/username existe (dans profile ou dans _json)
  const hasLoginInRoot = 'login' in profile;
  const hasUsernameInRoot = 'username' in profile;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const hasLoginInJson = hasJsonObject && 'login' in profile._json;

  const hasLogin = hasLoginInRoot || hasUsernameInRoot || hasLoginInJson;

  if (!hasLogin) {
    return false;
  }

  return true;
}

export function isSpotifyProfile(profile: any): profile is SpotifyProfile {
  return (
    typeof profile === 'object' && 'id' in profile && 'display_name' in profile
  );
}

export function isGitLabProfile(profile: any): profile is GitLabProfile {
  return (
    typeof profile === 'object' && 'id' in profile && 'username' in profile
  );
}
