import { Link } from 'react-router-dom';
import { FiActivity, FiSettings, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';
import {
  PageLayout,
  PageHeader,
  ContentGrid,
  Card,
  Text,
} from '@/components/ui';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const t = useTranslation();

  if (!user) {
    return null;
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title={t('dashboard.welcome', { name: user.name || user.email })}
        subtitle={t('dashboard.subtitle')}
      />

      <ContentGrid columns={2} gap="lg">
        <Link to="/area" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiActivity />
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.automations.title')}
              </Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.automations.description')}
              </Text>
              <Text variant="caption">→</Text>
            </div>
          </Card>
        </Link>

        <Link to="/services" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiSettings />
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.services.title')}
              </Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.services.description')}
              </Text>
              <Text variant="caption">→</Text>
            </div>
          </Card>
        </Link>

        <Link to="/profile" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiUser />
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.profile.title')}
              </Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.profile.description')}
              </Text>
              <Text variant="caption">→</Text>
            </div>
          </Card>
        </Link>

        <Link to="/about" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiInfo />
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.about.title')}
              </Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                {t('dashboard.cards.about.description')}
              </Text>
              <Text variant="caption">→</Text>
            </div>
          </Card>
        </Link>
      </ContentGrid>

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <Card padding="lg">
          <div style={{ marginBottom: 16 }}>
            <Text variant="subtitle">{t('dashboard.accountInfo.title')}</Text>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">
                Email
              </Text>
              <Text variant="body">{user.email}</Text>
            </div>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">
                Role
              </Text>
              <Text
                variant="caption"
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  backgroundColor: 'var(--color-surface-muted)',
                }}
              >
                {user.role}
              </Text>
            </div>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">
                Provider
              </Text>
              <Text variant="body">
                {user.provider === 'local'
                  ? 'Email/Password'
                  : user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)}
              </Text>
            </div>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">
                Member since
              </Text>
              <Text variant="body">
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
