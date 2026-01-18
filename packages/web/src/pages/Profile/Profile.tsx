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
  Text,
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
      return 'Email/Password';
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
              <Text variant="subtitle" style={{ margin: 0 }}>
                {t('profile.personalInfo.title')}
              </Text>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiUser />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">
                    {t('profile.personalInfo.name')}
                  </Text>
                  <Text variant="body">{user.name || t('profile.notSet')}</Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiMail />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">
                    {t('profile.personalInfo.email')}
                  </Text>
                  <Text variant="body">{user.email}</Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiShield />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">
                    {t('profile.personalInfo.role')}
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
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiKey />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">
                    {t('profile.personalInfo.provider')}
                  </Text>
                  <Text variant="body">
                    {getProviderDisplay(user.provider)}
                  </Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiCalendar />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">
                    {t('profile.personalInfo.accountCreated')}
                  </Text>
                  <Text variant="body">{formatDate(user.created_at)}</Text>
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
                <Text variant="caption" color="muted">
                  {t('profile.stats.accountStatus')}
                </Text>
                <Text variant="body" style={{ fontWeight: '600' }}>
                  {t('profile.stats.active')}
                </Text>
              </div>
            </div>
          </Card>

          <Card padding="lg" className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon}>
                <FiCalendar />
              </div>
              <div className={styles.statInfo}>
                <Text variant="caption" color="muted">
                  {t('profile.stats.memberSince')}
                </Text>
                <Text variant="body" style={{ fontWeight: '600' }}>
                  {new Date(user.created_at).getFullYear()}
                </Text>
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
              <Text variant="subtitle" style={{ margin: 0 }}>
                {t('profile.actions.title')}
              </Text>
            </div>

            <div className={styles.actionsGrid}>
              <div className={styles.actionItem}>
                <div className={styles.actionInfo}>
                  <Text variant="subtitle" style={{ marginBottom: 4 }}>
                    {t('profile.actions.signOut')}
                  </Text>
                  <Text variant="body" color="muted">
                    {t('profile.actions.signOutDescription')}
                  </Text>
                </div>
                <Button
                  variant="danger"
                  leftIcon={<FiLogOut />}
                  onClick={logout}
                >
                  {t('profile.actions.signOut')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
