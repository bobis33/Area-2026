import {
  FiUser,
  FiMail,
  FiShield,
  FiKey,
  FiCalendar,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';
import {
  PageLayout,
  PageHeader,
  ContentGrid,
  Card,
  Button,
} from '@/components/ui';
import styles from './Profile.module.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const t = useTranslation();

  if (!user) {
    return null;
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProviderDisplay = (provider: string) => {
    if (provider === 'local') {
      return t('profile.provider');
    }
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  return (
    <PageLayout maxWidth="lg">
      <PageHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <div className={styles.content}>
        {/* Personal Information Card */}
        <Card padding="lg">
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiUser />
              </div>
              <h2 className={styles.sectionTitle}>
                {t('profile.personalInfo')}
              </h2>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiUser />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>
                    {t('profile.fullName')}
                  </span>
                  <span className={styles.infoValue}>
                    {user.name || t('profile.notSet')}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiMail />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>{t('profile.email')}</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiShield />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>{t('profile.role')}</span>
                  <span className={styles.roleBadge}>{user.role}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiKey />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>
                    {t('profile.provider')}
                  </span>
                  <span className={styles.infoValue}>
                    {getProviderDisplay(user.provider)}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiCalendar />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>
                    {t('profile.accountCreated')}
                  </span>
                  <span className={styles.infoValue}>
                    {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Statistics Card */}
        <ContentGrid columns={2} gap="lg">
          <Card padding="lg" className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon}>
                <FiShield />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>
                  {t('profile.accountStatus')}
                </span>
                <span className={styles.statValue}>{t('profile.active')}</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon}>
                <FiCalendar />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>
                  {t('profile.memberSince')}
                </span>
                <span className={styles.statValue}>
                  {new Date(user.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </Card>
        </ContentGrid>

        {/* Account Actions Card */}
        <Card padding="lg">
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiShield />
              </div>
              <h2 className={styles.sectionTitle}>
                {t('profile.accountActions')}
              </h2>
            </div>

            <div className={styles.actionsGrid}>
              <div className={styles.actionItem}>
                <div className={styles.actionInfo}>
                  <h3 className={styles.actionTitle}>{t('profile.logout')}</h3>
                  <p className={styles.actionDescription}>
                    {t('profile.logoutDescription')}
                  </p>
                </div>
                <Button
                  variant="danger"
                  leftIcon={<FiLogOut />}
                  onClick={logout}
                >
                  {t('profile.logout')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
