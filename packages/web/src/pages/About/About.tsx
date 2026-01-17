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
import { PageLayout, PageHeader, ContentGrid, Card } from '@/components/ui';
import { ServiceIcon } from '@/components/icons';
import { useTranslation } from '@/contexts/I18nContext';
import styles from './About.module.css';

export default function About() {
  const t = useTranslation();
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
          <p className={styles.loadingText}>{t('common.loading')}</p>
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
            <h2 className={styles.errorTitle}>{t('errors.generic')}</h2>
            <p className={styles.errorText}>{error || t('about.noData')}</p>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader title={t('about.title')} subtitle={t('about.description')} />

      {/* Server Information */}
      <Card padding="lg">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiServer />
            </div>
            <h2 className={styles.sectionTitle}>{t('about.server.title')}</h2>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FiServer />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  {t('about.server.host')}
                </span>
                <span className={styles.infoValue}>
                  {aboutData.client.host}
                </span>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <FiClock />
              </div>
              <div className={styles.infoContent}>
                <span className={styles.infoLabel}>
                  {t('about.server.time')}
                </span>
                <span className={styles.infoValue}>
                  {formatTimestamp(aboutData.server.current_time)}
                </span>
              </div>
            </div>

            {aboutData.server.uptime !== undefined && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiActivity />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>{t('about.uptime')}</span>
                  <span className={styles.infoValue}>
                    {formatUptime(aboutData.server.uptime)}
                  </span>
                </div>
              </div>
            )}

            {aboutData.server.version && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiPackage />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>{t('about.version')}</span>
                  <span className={styles.infoValue}>
                    {aboutData.server.version}
                  </span>
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
          <h2 className={styles.sectionTitle}>{t('about.server.services')}</h2>
          <span className={styles.sectionBadge}>
            {aboutData.server.services.length} {t('about.services.title')}
          </span>
        </div>

        {aboutData.server.services.length === 0 ||
        !aboutData.server.services[0].name ? (
          <Card padding="lg">
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiPackage />
              </div>
              <h3 className={styles.emptyTitle}>{t('about.noServices')}</h3>
              <p className={styles.emptyText}>
                {t('about.noServicesDescription')}
              </p>
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
                    <h3 className={styles.serviceTitle}>{service.name}</h3>
                  </div>

                  <div className={styles.serviceSection}>
                    <div className={styles.serviceSectionHeader}>
                      <FiZap size={16} />
                      <h4 className={styles.serviceSectionTitle}>
                        {t('about.services.actions')}
                      </h4>
                      <span className={styles.serviceBadge}>
                        {service.actions.length}
                      </span>
                    </div>
                    {service.actions.length === 0 ||
                    !service.actions[0].name ? (
                      <p className={styles.emptyList}>{t('about.noActions')}</p>
                    ) : (
                      <ul className={styles.serviceList}>
                        {service.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className={styles.serviceItem}>
                            <span className={styles.itemName}>
                              {action.name}
                            </span>
                            {action.description && (
                              <span className={styles.itemDescription}>
                                {action.description}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className={styles.serviceSection}>
                    <div className={styles.serviceSectionHeader}>
                      <FiRefreshCw size={16} />
                      <h4 className={styles.serviceSectionTitle}>
                        {t('about.services.reactions')}
                      </h4>
                      <span className={styles.serviceBadge}>
                        {service.reactions.length}
                      </span>
                    </div>
                    {service.reactions.length === 0 ||
                    !service.reactions[0].name ? (
                      <p className={styles.emptyList}>
                        {t('about.noReactions')}
                      </p>
                    ) : (
                      <ul className={styles.serviceList}>
                        {service.reactions.map((reaction, reactionIndex) => (
                          <li
                            key={reactionIndex}
                            className={styles.serviceItem}
                          >
                            <span className={styles.itemName}>
                              {reaction.name}
                            </span>
                            {reaction.description && (
                              <span className={styles.itemDescription}>
                                {reaction.description}
                              </span>
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
