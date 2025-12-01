import { ConfigService } from '@nestjs/config';
import {
  OAuthProvider,
  OAuthProviderConfig,
  NormalizedOAuthProfile,
  isDiscordProfile,
  isGoogleProfile,
  isGitHubProfile,
  DiscordProfile,
  GoogleProfile,
  GitHubProfile,
} from '@auth/interfaces/oauth.types';

export function getProviderConfig(
  provider: OAuthProvider,
  configService: ConfigService,
): OAuthProviderConfig {
  const configs: Record<OAuthProvider, OAuthProviderConfig> = {
    [OAuthProvider.DISCORD]: {
      clientID: configService.get<string>('DISCORD_CLIENT_ID') || '',
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('DISCORD_CLIENT_CALLBACK_URL') ||
        'http://localhost:8080/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    [OAuthProvider.GOOGLE]: {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL') ||
        'http://localhost:8080/auth/google/callback',
      scope: ['profile', 'email'],
    },
    [OAuthProvider.GITHUB]: {
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('GITHUB_CLIENT_CALLBACK_URL') ||
        'http://localhost:8080/auth/github/callback',
      scope: ['user:email'],
    },
  };

  return configs[provider];
}

export function normalizeOAuthProfile(
  profile: DiscordProfile | GoogleProfile | GitHubProfile,
  provider: OAuthProvider,
): NormalizedOAuthProfile {
  let normalizedProfile: NormalizedOAuthProfile;

  switch (provider) {
    case OAuthProvider.DISCORD:
      if (!isDiscordProfile(profile)) {
        throw new Error('Invalid Discord profile structure');
      }
      normalizedProfile = {
        id: profile.id,
        email: profile.email || '',
        username: profile.username,
        displayName: profile.username || profile.id,
        avatar: profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : undefined,
        provider: OAuthProvider.DISCORD,
        provider_id: profile.id,
        raw: profile,
      };
      break;

    case OAuthProvider.GOOGLE:
      if (!isGoogleProfile(profile)) {
        throw new Error('Invalid Google profile structure');
      }
      normalizedProfile = {
        id: profile.id,
        email: profile.emails?.[0]?.value || '',
        username: profile.emails?.[0]?.value?.split('@')[0],
        displayName: profile.displayName || profile.name?.givenName || 'User',
        avatar: profile.photos?.[0]?.value,
        provider: OAuthProvider.GOOGLE,
        provider_id: profile.id,
        raw: profile,
      };
      break;

    case OAuthProvider.GITHUB: {
      // Be tolerant: treat profile as "any" to support the real passport-github2 shape
      const gh: any = profile;

      // Try to get a primary email from multiple possible locations
      const primaryEmail =
        gh.emails?.[0]?.value ||
        gh._json?.email ||
        '';
      // Try to get a stable profile ID
      // We use the id, node_id, and id.toString() to get a stable profile ID
      // This is to avoid issues with the profile ID being different on the client and server
      // If the profile ID is not found, we use an empty string
      // This is to avoid issues with the profile ID being different on the client and server
      // j'ai mis sa car c'est la seule manière que j'ai trouvée pour que le profile ID soit stable
      // j'ai essayé de faire un getStableProfileId() mais ça ne fonctionnait pas
      // et momo ton ancienne methode etais trop strict.
      const profileId =
        gh.id?.toString?.() ??
        gh.id ??
        gh.node_id ??
        '';

      normalizedProfile = {
        id: profileId,
        email: primaryEmail,
        username: gh.username || gh.login || gh._json?.login || '',
        displayName:
          gh.displayName ||
          gh.name ||
          gh.login ||
          gh._json?.name ||
          'GitHub user',
        avatar:
          gh.avatar_url ||
          gh.photos?.[0]?.value ||
          gh._json?.avatar_url,
        provider: OAuthProvider.GITHUB,
        provider_id: profileId,
        raw: gh,
      };

      break;
    }

    default:
      throw new Error('Unsupported OAuth provider');
  }

  if (!normalizedProfile.email) {
    if (provider === OAuthProvider.GITHUB) {
      const fallbackLocalPart =
        normalizedProfile.username ||
        normalizedProfile.displayName ||
        normalizedProfile.id ||
        'github-user';

      normalizedProfile.email = `${fallbackLocalPart}@github.local`;
    } else {
      throw new Error('Email not provided by OAuth provider');
    }
  }

  return normalizedProfile;
}

export function isProviderEnabled(
  provider: OAuthProvider,
  configService: ConfigService,
): boolean {
  const config = getProviderConfig(provider, configService);
  return !!(config.clientID && config.clientSecret);
}

export function getEnabledProviders(
  configService: ConfigService,
): OAuthProvider[] {
  return Object.values(OAuthProvider).filter((provider) =>
    isProviderEnabled(provider, configService),
  );
}
