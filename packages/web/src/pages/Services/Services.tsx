import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaDiscord,
  FaGitlab,
  FaGithub,
  FaGoogle,
  FaLink,
  FaSpotify,
} from 'react-icons/fa';
import { WebButton, WebCard } from '@/components/ui-web';
import {
  getLinkedProviders,
  getOAuthProviders,
  loginWithOAuth,
  unlinkProvider,
} from '@/services/auth.service';
import { getAuthToken, setOAuthRedirectPath } from '@/utils/storage';
import './Services.css';

const OAUTH_PROVIDERS = [
  'discord',
  'google',
  'github',
  'gitlab',
  'spotify',
] as const;

type OAuthProviderKey = (typeof OAUTH_PROVIDERS)[number];

const PROVIDER_META: Record<
  OAuthProviderKey,
  { label: string; description: string; color: string; icon: typeof FaLink }
> = {
  discord: {
    label: 'Discord',
    description: 'React to community activity and sync conversations.',
    color: '#5865F2',
    icon: FaDiscord,
  },
  google: {
    label: 'Google',
    description: 'Connect productivity tools like Sheets and Gmail.',
    color: '#0F9D58',
    icon: FaGoogle,
  },
  github: {
    label: 'GitHub',
    description: 'Automate issues, commits, and repository events.',
    color: '#111827',
    icon: FaGithub,
  },
  gitlab: {
    label: 'GitLab',
    description: 'Keep your CI/CD pipelines in sync with automations.',
    color: '#FC6D26',
    icon: FaGitlab,
  },
  spotify: {
    label: 'Spotify',
    description: 'Trigger flows from playlists and listening activity.',
    color: '#1DB954',
    icon: FaSpotify,
  },
};

const PROVIDER_ORDER: OAuthProviderKey[] = [
  'discord',
  'google',
  'github',
  'gitlab',
  'spotify',
];

const normalizeProvider = (provider: string) => provider.trim().toLowerCase();

const getProviderLabel = (provider: string) =>
  provider.charAt(0).toUpperCase() + provider.slice(1);

export default function Services() {
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlinkingProviders, setUnlinkingProviders] = useState<Set<string>>(
    new Set(),
  );

  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();

    if (!token) {
      setError('Missing authentication token. Please log in again.');
      setLoading(false);
      return;
    }

    const [available, linked] = await Promise.all([
      getOAuthProviders(),
      getLinkedProviders(token),
    ]);

    setAvailableProviders(available.map(normalizeProvider));
    setLinkedProviders(linked.map(normalizeProvider));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const allProviders = useMemo(() => {
    const normalized = [...availableProviders, ...linkedProviders].filter(
      (provider): provider is string =>
        typeof provider === 'string' && provider.trim().length > 0,
    );
    const unique = new Set(normalized);
    return Array.from(unique).sort((a, b) => {
      const aIndex = PROVIDER_ORDER.indexOf(a as OAuthProviderKey);
      const bIndex = PROVIDER_ORDER.indexOf(b as OAuthProviderKey);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [availableProviders, linkedProviders]);

  const connectedProviders = allProviders.filter((provider) =>
    linkedProviders.includes(provider),
  );
  const availableToConnect = allProviders.filter(
    (provider) => !linkedProviders.includes(provider),
  );

  const handleConnect = (provider: string) => {
    if (!OAUTH_PROVIDERS.includes(provider as OAuthProviderKey)) {
      setError(`Unsupported provider: ${provider}`);
      return;
    }
    setError(null);
    setOAuthRedirectPath('/services');
    loginWithOAuth(provider as OAuthProviderKey);
  };

  const handleDisconnect = async (provider: string) => {
    const token = getAuthToken();
    if (!token) {
      setError('Missing authentication token. Please log in again.');
      return;
    }
    setError(null);
    setUnlinkingProviders((prev) => new Set(prev).add(provider));
    const ok = await unlinkProvider(token, provider);
    if (ok) {
      setLinkedProviders((prev) => prev.filter((item) => item !== provider));
    } else {
      setError('Failed to disconnect provider. Please try again.');
    }
    setUnlinkingProviders((prev) => {
      const next = new Set(prev);
      next.delete(provider);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="services-container">
        <div className="services-loading">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-container">
        <div className="services-error">
          <h2>Unable to load services</h2>
          <p>{error}</p>
          <WebButton label="Retry" onClick={loadProviders} />
        </div>
      </div>
    );
  }

  return (
    <div className="services-container">
      <div className="services-hero">
        <div className="services-hero-content">
          <span className="services-eyebrow">Providers</span>
          <h1>Connect the services that power your workflows</h1>
          <p>
            Link multiple providers to unlock new triggers, reactions, and
            automations across your stack.
          </p>
        </div>
        <div className="services-hero-panel">
          <div>
            <span className="services-panel-label">Connected</span>
            <span className="services-panel-value">{connectedProviders.length}</span>
          </div>
          <div>
            <span className="services-panel-label">Available</span>
            <span className="services-panel-value">{availableToConnect.length}</span>
          </div>
        </div>
      </div>

      <section className="services-section">
        <div className="services-section-header">
          <h2>Connected</h2>
          <p>These providers are ready for your automations.</p>
        </div>
        {allProviders.length === 0 ? (
          <div className="services-empty">
            No OAuth providers are configured on the server.
          </div>
        ) : connectedProviders.length === 0 ? (
          <div className="services-empty">
            No services connected yet. Connect one below to get started.
          </div>
        ) : (
          <div className="services-grid">
            {connectedProviders.map((provider) => {
              const meta = PROVIDER_META[provider as OAuthProviderKey];
              const Icon = meta?.icon ?? FaLink;
              const isUnlinking = unlinkingProviders.has(provider);
              return (
                <WebCard
                  key={provider}
                  className="service-card service-card-connected"
                >
                  <div className="service-card-header">
                    <div
                      className="service-icon"
                      style={{ background: meta?.color ?? '#1e40af' }}
                    >
                      <Icon />
                    </div>
                    <span className="service-status service-status-connected">
                      Connected
                    </span>
                  </div>
                  <h3>{meta?.label ?? getProviderLabel(provider)}</h3>
                  <p>
                    {meta?.description ?? 'Provider connected to your account.'}
                  </p>
                  <div className="service-card-actions">
                    <WebButton
                      label={isUnlinking ? 'Disconnecting...' : 'Disconnect'}
                      variant="ghost"
                      className="service-button-danger"
                      disabled={isUnlinking}
                      onClick={() => handleDisconnect(provider)}
                    />
                  </div>
                </WebCard>
              );
            })}
          </div>
        )}
      </section>

      <section className="services-section">
        <div className="services-section-header">
          <h2>Available to connect</h2>
          <p>Authorize new providers to unlock more triggers and reactions.</p>
        </div>
        {allProviders.length === 0 ? (
          <div className="services-empty">
            No OAuth providers are configured on the server.
          </div>
        ) : availableToConnect.length === 0 ? (
          <div className="services-empty">
            All available providers are already connected.
          </div>
        ) : (
          <div className="services-grid">
            {availableToConnect.map((provider) => {
              const meta = PROVIDER_META[provider as OAuthProviderKey];
              const Icon = meta?.icon ?? FaLink;
              return (
                <WebCard key={provider} className="service-card">
                  <div className="service-card-header">
                    <div
                      className="service-icon"
                      style={{ background: meta?.color ?? '#1e40af' }}
                    >
                      <Icon />
                    </div>
                    <span className="service-status">Not connected</span>
                  </div>
                  <h3>{meta?.label ?? getProviderLabel(provider)}</h3>
                  <p>
                    {meta?.description ?? 'Connect this provider to use it.'}
                  </p>
                  <div className="service-card-actions">
                    <WebButton
                      label="Connect"
                      onClick={() => handleConnect(provider)}
                    />
                  </div>
                </WebCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
