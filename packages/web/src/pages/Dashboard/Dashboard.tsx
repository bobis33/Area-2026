import { Link } from 'react-router-dom';
import { FiActivity, FiSettings, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';
import { PageLayout, PageHeader, ContentGrid, Card } from '@/components/ui';
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
              <h2 className={styles.cardTitle}>
                {t('dashboard.cards.myAutomations.title')}
              </h2>
              <p className={styles.cardDescription}>
                {t('dashboard.cards.myAutomations.description')}
              </p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Card>
        </Link>

        <Link to="/services" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiSettings />
              </div>
              <h2 className={styles.cardTitle}>
                {t('dashboard.cards.connectedServices.title')}
              </h2>
              <p className={styles.cardDescription}>
                {t('dashboard.cards.connectedServices.description')}
              </p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Card>
        </Link>

        <Link to="/profile" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiUser />
              </div>
              <h2 className={styles.cardTitle}>
                {t('dashboard.cards.myProfile.title')}
              </h2>
              <p className={styles.cardDescription}>
                {t('dashboard.cards.myProfile.description')}
              </p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Card>
        </Link>

        <Link to="/about" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiInfo />
              </div>
              <h2 className={styles.cardTitle}>
                {t('dashboard.cards.aboutArea.title')}
              </h2>
              <p className={styles.cardDescription}>
                {t('dashboard.cards.aboutArea.description')}
              </p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Card>
        </Link>
      </ContentGrid>

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <Card padding="lg">
          <h3 className={styles.sectionTitle}>
            {t('dashboard.accountInfo.title')}
          </h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                {t('dashboard.accountInfo.email')}
              </span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                {t('dashboard.accountInfo.role')}
              </span>
              <span className={styles.infoValue}>
                <span className={styles.roleBadge}>{user.role}</span>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                {t('dashboard.accountInfo.provider')}
              </span>
              <span className={styles.infoValue}>
                {user.provider === 'local'
                  ? t('dashboard.accountInfo.emailPassword')
                  : user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                {t('dashboard.accountInfo.memberSince')}
              </span>
              <span className={styles.infoValue}>
                {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
