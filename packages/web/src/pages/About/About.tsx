import { useEffect, useState } from 'react';
import {
  FiServer,
  FiClock,
  FiZap,
  FiPackage,
  FiActivity,
  FiRefreshCw,
} from 'react-icons/fi';
import { get } from '@/services/api';
import type { AboutResponse } from '@/types';
import { PageLayout, PageHeader, ContentGrid, Card, Text } from '@/components/ui';
import { ServiceIcon } from '@/components/icons';
import styles from './About.module.css';

export default function About() {
  const [aboutData, setAboutData] = useState<AboutResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        }
        setError(null);
        const data = await get<AboutResponse>('/about.json');
        setAboutData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch server information',
        );
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    };

    fetchAboutData(true);

    const interval = setInterval(() => fetchAboutData(false), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0s';
  };

  if (loading) {
    return (
      <PageLayout maxWidth="xl">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <Text variant="body" color="muted">Loading server information...</Text>
        </div>
      </PageLayout>
    );
  }

  if (error || !aboutData) {
    return (
      <PageLayout maxWidth="xl">
        <Card padding="lg">
          <div className={styles.errorState}>
            <div className={styles.errorIcon}>
              <FiServer />
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text variant="subtitle">Unable to load server info</Text>
            </div>
            <Text variant="body" color="danger">{error || 'No data available'}</Text>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title="About AREA"
        subtitle="Server information, available services, and real-time status"
      />

      {/* Server Information */}
      <Card padding="lg">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiServer />
            </div>
            <Text variant="subtitle" style={{ margin: 0 }}>Server Information</Text>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FiServer />
              </div>
              <div className={styles.infoContent}>
                <Text variant="caption" color="muted">Host</Text>
                <Text variant="body">
                  {aboutData.client.host}
                </Text>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FiClock />
              </div>
              <div className={styles.infoContent}>
                <Text variant="caption" color="muted">Current Time</Text>
                <Text variant="body">
                  {formatTimestamp(aboutData.server.current_time)}
                </Text>
              </div>
            </div>

            {aboutData.server.uptime !== undefined && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiActivity />
                </div>
              <div className={styles.infoContent}>
                <Text variant="caption" color="muted">Uptime</Text>
                <Text variant="body">
                  {formatUptime(aboutData.server.uptime)}
                </Text>
              </div>
              </div>
            )}

            {aboutData.server.version && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiPackage />
                </div>
              <div className={styles.infoContent}>
                <Text variant="caption" color="muted">Version</Text>
                <Text variant="body">
                  {aboutData.server.version}
                </Text>
              </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Available Services */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <FiPackage />
          </div>
          <Text variant="subtitle" style={{ margin: 0 }}>Available Services</Text>
          <Text variant="caption" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'var(--color-surface-muted)' }}>
            {aboutData.server.services.length} Services
          </Text>
        </div>

        {aboutData.server.services.length === 0 ||
        !aboutData.server.services[0].name ? (
          <Card padding="lg">
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiPackage />
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text variant="subtitle">No Services Yet</Text>
              </div>
              <Text variant="body" color="muted">
                No services are configured on the server at this time.
              </Text>
            </div>
          </Card>
        ) : (
          <ContentGrid columns={2} gap="lg">
            {aboutData.server.services.map((service, index) => (
              <Card key={index} padding="lg" hoverable>
                <div className={styles.serviceCard}>
                  <div className={styles.serviceHeader}>
                    <div className={styles.serviceIconWrapper}>
                      <ServiceIcon service={service.name} size={32} />
                    </div>
                    <Text variant="subtitle" style={{ margin: 0 }}>{service.name}</Text>
                  </div>

                  <div className={styles.serviceSection}>
                    <div className={styles.serviceSectionHeader}>
                      <FiZap size={16} />
                      <Text variant="body" style={{ fontWeight: '600', margin: 0 }}>Actions</Text>
                      <Text variant="caption" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'var(--color-surface-muted)' }}>
                        {service.actions.length}
                      </Text>
                    </div>
                    {service.actions.length === 0 ||
                    !service.actions[0].name ? (
                      <Text variant="body" color="muted">No actions available</Text>
                    ) : (
                      <ul className={styles.serviceList}>
                        {service.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className={styles.serviceItem}>
                            <Text variant="body" style={{ fontWeight: '600' }}>
                              {action.name}
                            </Text>
                            {action.description && (
                              <Text variant="caption" color="muted">
                                {action.description}
                              </Text>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={styles.serviceSection}>
                    <div className={styles.serviceSectionHeader}>
                      <FiRefreshCw size={16} />
                      <Text variant="body" style={{ fontWeight: '600', margin: 0 }}>Reactions</Text>
                      <Text variant="caption" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'var(--color-surface-muted)' }}>
                        {service.reactions.length}
                      </Text>
                    </div>
                    {service.reactions.length === 0 ||
                    !service.reactions[0].name ? (
                      <Text variant="body" color="muted">No reactions available</Text>
                    ) : (
                      <ul className={styles.serviceList}>
                        {service.reactions.map((reaction, reactionIndex) => (
                          <li
                            key={reactionIndex}
                            className={styles.serviceItem}
                          >
                            <Text variant="body" style={{ fontWeight: '600' }}>
                              {reaction.name}
                            </Text>
                            {reaction.description && (
                              <Text variant="caption" color="muted">
                                {reaction.description}
                              </Text>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </ContentGrid>
        )}
      </div>
    </PageLayout>
  );
}
