import { ConfigService } from '@nestjs/config';
import {
  OAuthProvider,
  OAuthProviderConfig,
  NormalizedOAuthProfile,
} from '@interfaces/oauth';

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
    [OAuthProvider.SPOTIFY]: {
      clientID: configService.get<string>('SPOTIFY_CLIENT_ID') || '',
      clientSecret: configService.get<string>('SPOTIFY_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('SPOTIFY_CALLBACK_URL') ||
        'http://127.0.0.1:8080/auth/spotify/callback',
      scope: ['user-read-email', 'user-read-private'],
    },
    [OAuthProvider.GITLAB]: {
      clientID: configService.get<string>('GITLAB_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GITLAB_CLIENT_SECRET') || '',
      callbackURL:
        configService.get<string>('GITLAB_CALLBACK_URL') ||
        'http://localhost:8080/auth/gitlab/callback',
      scope: ['read_user'],
    },
  };

  return configs[provider];
}

export function normalizeOAuthProfile(
  profile: any,
  provider: OAuthProvider,
): NormalizedOAuthProfile {
  let normalizedProfile: NormalizedOAuthProfile;

  const p = profile;

  switch (provider) {
    case OAuthProvider.DISCORD:
      normalizedProfile = {
        id: p.id,
        email: p.email || '',
        username: p.username,
        displayName: p.global_name || p.username || p.id,
        avatar: p.avatar
          ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.png`
          : undefined,
        provider: OAuthProvider.DISCORD,
        provider_id: p.id,
        raw: p,
      };
      break;

    case OAuthProvider.GOOGLE:
      normalizedProfile = {
        id: p.id,
        email: p.emails?.[0]?.value || p.email || '',
        username: p.emails?.[0]?.value?.split('@')[0],
        displayName: p.displayName || p.name?.givenName || 'Google User',
        avatar: p.photos?.[0]?.value,
        provider: OAuthProvider.GOOGLE,
        provider_id: p.id,
        raw: p,
      };
      break;

    case OAuthProvider.GITHUB: {
      const id = String(p.id || p.node_id || p._json?.id);
      normalizedProfile = {
        id: id,
        email: p.emails?.[0]?.value || p.email || p._json?.email || '',
        username: p.username || p.login || 'GitHub User',
        displayName: p.displayName || p.username || 'GitHub User',
        avatar: p.photos?.[0]?.value || p.avatar_url,
        provider: OAuthProvider.GITHUB,
        provider_id: id,
        raw: p,
      };
      break;
    }

    case OAuthProvider.SPOTIFY:
      normalizedProfile = {
        id: p.id,
        email: p.emails?.[0]?.value || p.email || '',
        username: p.id,
        displayName: p.displayName || p.display_name || 'Spotify User',
        avatar: p.photos?.[0]?.value || p.images?.[0]?.url,
        provider: OAuthProvider.SPOTIFY,
        provider_id: p.id,
        raw: p,
      };
      break;

    case OAuthProvider.GITLAB:
      const glId = String(p.id);
      normalizedProfile = {
        id: glId,
        email: p.email || p.emails?.[0]?.value || '',
        username: p.username,
        displayName: p.displayName || p.name || p.username || 'GitLab User',
        avatar: p.avatar_url || p.avatarUrl,
        provider: OAuthProvider.GITLAB,
        provider_id: glId,
        raw: p,
      };
      break;

    default:
      throw new Error('Unsupported OAuth provider');
  }

  if (!normalizedProfile.email) {
    console.warn(`Email manquant ! Génération d'un email placeholder.`);

    normalizedProfile.email = `${provider.toLowerCase()}_${normalizedProfile.provider_id}@no-email.area.local`;
  }

  return normalizedProfile;
}

function isProviderEnabled(
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
