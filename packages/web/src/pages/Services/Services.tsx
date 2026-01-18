import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaDiscord,
  FaGitlab,
  FaGithub,
  FaGoogle,
  FaLink,
  FaSpotify,
} from 'react-icons/fa';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';
import { useTranslation } from '@/contexts/I18nContext';
import {
  PageLayout,
  PageHeader,
  ContentGrid,
  Card,
  Button,
  Text,
} from '@/components/ui';
import {
  getLinkedProviders,
  getOAuthProviders,
  loginWithOAuth,
  unlinkProvider,
} from '@/services/auth.service';
import { getAuthToken, setOAuthRedirectPath } from '@/utils/storage';
import styles from './Services.module.css';

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
  const t = useTranslation();
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
      setError(t('services.errors.missingToken'));
      setLoading(false);
      return;
    }

    try {
      const [available, linked] = await Promise.all([
        getOAuthProviders(),
        getLinkedProviders(token),
      ]);

      setAvailableProviders(available.map(normalizeProvider));
      setLinkedProviders(linked.map(normalizeProvider));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t('services.errors.loadFailed'),
      );
    } finally {
      setLoading(false);
    }
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
      setError(t('services.errors.unsupportedProvider', { provider }));
      return;
    }
    setError(null);
    setOAuthRedirectPath('/services');
    loginWithOAuth(provider as OAuthProviderKey);
  };

  const handleDisconnect = async (provider: string) => {
    const token = getAuthToken();
    if (!token) {
      setError(t('services.errors.missingToken'));
      return;
    }
    setError(null);
    setUnlinkingProviders((prev) => new Set(prev).add(provider));
    const ok = await unlinkProvider(token, provider);
    if (ok) {
      setLinkedProviders((prev) => prev.filter((item) => item !== provider));
    } else {
      setError(t('services.errors.disconnectFailed'));
    }
    setUnlinkingProviders((prev) => {
      const next = new Set(prev);
      next.delete(provider);
      return next;
    });
  };

  if (loading) {
    return (
      <PageLayout maxWidth="xl">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <Text variant="body" color="muted">
            {t('services.loading')}
          </Text>
        </div>
      </PageLayout>
    );
  }

  if (error && allProviders.length === 0) {
    return (
      <PageLayout maxWidth="xl">
        <Card padding="lg">
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <FiX size={48} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text variant="subtitle">
                {t('services.errors.unableToLoad')}
              </Text>
            </div>
            <Text variant="body" color="danger">
              {error}
            </Text>
            <Button
              variant="primary"
              leftIcon={<FiRefreshCw />}
              onClick={loadProviders}
            >
              {t('common.retry')}
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title={t('services.title')}
        subtitle={t('services.subtitle')}
      />

      {/* Stats Panel */}
      <div className={styles.statsPanel}>
        <Card padding="lg" className={styles.statCard}>
          <div className={styles.statContent}>
            <Text variant="title" style={{ marginBottom: 4 }}>
              {connectedProviders.length}
            </Text>
            <Text variant="caption" color="muted">
              {t('services.stats.connected')}
            </Text>
          </div>
        </Card>
        <Card padding="lg" className={styles.statCard}>
          <div className={styles.statContent}>
            <Text variant="title" style={{ marginBottom: 4 }}>
              {availableToConnect.length}
            </Text>
            <Text variant="caption" color="muted">
              {t('services.stats.available')}
            </Text>
          </div>
        </Card>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <Text variant="body" color="danger">
            {error}
          </Text>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Connected Services */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">
              {t('services.connectedServices.title')}
            </Text>
          </div>
          <Text variant="body" color="muted">
            {t('services.connectedServices.description')}
          </Text>
        </div>

        {allProviders.length === 0 ? (
          <Card padding="lg">
            <div className={styles.emptyState}>
              <Text variant="body" color="muted">
                {t('services.connectedServices.noProviders')}
              </Text>
            </div>
          </Card>
        ) : connectedProviders.length === 0 ? (
          <Card padding="lg">
            <div className={styles.emptyState}>
              <Text variant="body" color="muted">
                {t('services.connectedServices.noConnected')}
              </Text>
            </div>
          </Card>
        ) : (
          <ContentGrid columns={3} gap="lg">
            {connectedProviders.map((provider) => {
              const meta = PROVIDER_META[provider as OAuthProviderKey];
              const Icon = meta?.icon ?? FaLink;
              const isUnlinking = unlinkingProviders.has(provider);

              return (
                <Card key={provider} padding="lg" hoverable>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceHeader}>
                      <div
                        className={styles.serviceIcon}
                        style={{
                          backgroundColor:
                            meta?.color ?? 'var(--color-primary)',
                        }}
                      >
                        <Icon />
                      </div>
                      <Text
                        variant="caption"
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          backgroundColor: 'var(--color-success-soft)',
                          color: 'var(--color-success)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <FiCheck size={14} />
                        {t('services.status.connected')}
                      </Text>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text variant="subtitle">
                        {meta?.label ?? getProviderLabel(provider)}
                      </Text>
                    </div>
                    <Text variant="body" color="muted">
                      {meta?.description ??
                        'Provider connected to your account.'}
                    </Text>

                    <div className={styles.serviceActions}>
                      <Button
                        variant="danger"
                        size="sm"
                        fullWidth
                        disabled={isUnlinking}
                        loading={isUnlinking}
                        onClick={() => handleDisconnect(provider)}
                      >
                        {isUnlinking
                          ? t('services.actions.disconnecting')
                          : t('services.actions.disconnect')}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </ContentGrid>
        )}
      </section>

      {/* Available Services */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="subtitle">
              {t('services.availableServices.title')}
            </Text>
          </div>
          <Text variant="body" color="muted">
            {t('services.availableServices.description')}
          </Text>
        </div>

        {allProviders.length === 0 ? (
          <Card padding="lg">
            <div className={styles.emptyState}>
              <Text variant="body" color="muted">
                {t('services.availableServices.noProviders')}
              </Text>
            </div>
          </Card>
        ) : availableToConnect.length === 0 ? (
          <Card padding="lg">
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiCheck size={48} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text variant="subtitle">
                  {t('services.availableServices.allConnected')}
                </Text>
              </div>
              <Text variant="body" color="muted">
                {t('services.availableServices.allConnectedDescription')}
              </Text>
            </div>
          </Card>
        ) : (
          <ContentGrid columns={3} gap="lg">
            {availableToConnect.map((provider) => {
              const meta = PROVIDER_META[provider as OAuthProviderKey];
              const Icon = meta?.icon ?? FaLink;

              return (
                <Card key={provider} padding="lg" hoverable>
                  <div className={styles.serviceCard}>
                    <div className={styles.serviceHeader}>
                      <div
                        className={styles.serviceIcon}
                        style={{
                          backgroundColor:
                            meta?.color ?? 'var(--color-primary)',
                        }}
                      >
                        <Icon />
                      </div>
                      <Text
                        variant="caption"
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          backgroundColor: 'var(--color-surface-muted)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {t('services.status.notConnected')}
                      </Text>
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <Text variant="subtitle">
                        {meta?.label ?? getProviderLabel(provider)}
                      </Text>
                    </div>
                    <Text variant="body" color="muted">
                      {meta?.description ?? 'Connect this provider to use it.'}
                    </Text>

                    <div className={styles.serviceActions}>
                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => handleConnect(provider)}
                      >
                        {t('services.actions.connect')}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </ContentGrid>
        )}
      </section>
    </PageLayout>
  );
}
