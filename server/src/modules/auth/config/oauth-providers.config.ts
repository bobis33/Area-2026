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
  isMobile: boolean = false,
): OAuthProviderConfig {
  if (provider === OAuthProvider.GITHUB && isMobile) {
    const mobileClientId = configService.get<string>('GITHUB_CLIENT_MOBILE_ID');
    const mobileClientSecret = configService.get<string>(
      'GITHUB_CLIENT_MOBILE_SECRET',
    );
    const mobileCallbackUrl = configService.get<string>(
      'GITHUB_CLIENT_MOBILE_CALLBACK_URL',
    );

    if (mobileClientId && mobileClientSecret) {
      return {
        clientID: mobileClientId,
        clientSecret: mobileClientSecret,
        callbackURL:
          mobileCallbackUrl || 'http://localhost:8080/auth/github/callback',
        scope: ['user:email'],
      };
    }
  }

  const configs: Record<OAuthProvider, OAuthProviderConfig> = {
    [OAuthProvider.DISCORD]: {
      clientID: configService.get<string>('DISCORD_CLIENT_ID') || '',
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') || '',
      callbackURL: isMobile
        ? configService.get<string>('DISCORD_CLIENT_MOBILE_CALLBACK_URL') ||
          configService.get<string>('DISCORD_CLIENT_CALLBACK_URL') ||
          'http://localhost:8080/auth/discord/callback'
        : configService.get<string>('DISCORD_CLIENT_CALLBACK_URL') ||
          'http://localhost:8080/auth/discord/callback',
      scope: ['identify', 'email'],
    },
    [OAuthProvider.GOOGLE]: {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: isMobile
        ? configService.get<string>('GOOGLE_CLIENT_MOBILE_CALLBACK_URL') ||
          configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL') ||
          'http://localhost:8080/auth/google/callback'
        : configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL') ||
          'http://localhost:8080/auth/google/callback',
      scope: ['profile', 'email'],
    },
    [OAuthProvider.GITHUB]: {
      clientID: configService.get<string>('GITHUB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || '',
      callbackURL: isMobile
        ? configService.get<string>('GITHUB_CLIENT_MOBILE_CALLBACK_URL') ||
          configService.get<string>('GITHUB_CLIENT_CALLBACK_URL') ||
          'http://localhost:8080/auth/github/callback'
        : configService.get<string>('GITHUB_CLIENT_CALLBACK_URL') ||
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
      if (!isGitHubProfile(profile)) {
        throw new Error('Invalid GitHub profile structure');
      }

      const primaryEmail =
        profile.emails?.[0]?.value || profile._json?.email || '';

      // Amélioration de l'extraction de l'ID
      const profileId = String(
        profile.id ||
          profile._json?.id ||
          profile.node_id ||
          profile._json?.node_id ||
          '',
      );

      if (!profileId) {
        throw new Error('GitHub profile missing ID');
      }

      normalizedProfile = {
        id: profileId,
        email: primaryEmail,
        username:
          profile.username || profile.login || profile._json?.login || '',
        displayName:
          profile.displayName ||
          profile._json?.name ||
          profile.username ||
          profile.login ||
          profile._json?.login ||
          'User',
        avatar:
          profile.photos?.[0]?.value ||
          profile._json?.avatar_url ||
          profile.avatar_url,
        provider: OAuthProvider.GITHUB,
        provider_id: profileId,
        raw: profile,
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
