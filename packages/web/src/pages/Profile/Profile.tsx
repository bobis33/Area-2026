import {
  FiUser,
  FiMail,
  FiShield,
  FiKey,
  FiCalendar,
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
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
      <PageHeader
        title="My Profile"
        subtitle="Manage your account information and preferences"
      />

      <div className={styles.content}>
        {/* Personal Information Card */}
        <Card padding="lg">
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIcon}>
                <FiUser />
              </div>
              <Text variant="subtitle" style={{ margin: 0 }}>Personal Information</Text>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiUser />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">Name</Text>
                  <Text variant="body">
                    {user.name || 'Not set'}
                  </Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiMail />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">Email</Text>
                  <Text variant="body">{user.email}</Text>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiShield />
                </div>
                <div className={styles.infoContent}>
                  <Text variant="caption" color="muted">Role</Text>
                  <Text variant="caption" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'var(--color-surface-muted)' }}>
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
                    Authentication Provider
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
                  <Text variant="caption" color="muted">Account Created</Text>
                  <Text variant="body">
                    {formatDate(user.created_at)}
                  </Text>
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
                <Text variant="caption" color="muted">Account Status</Text>
                <Text variant="body" style={{ fontWeight: '600' }}>Active</Text>
              </div>
            </div>
          </Card>

          <Card padding="lg" className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon}>
                <FiCalendar />
              </div>
              <div className={styles.statInfo}>
                <Text variant="caption" color="muted">Member Since</Text>
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
              <Text variant="subtitle" style={{ margin: 0 }}>Account Actions</Text>
            </div>

            <div className={styles.actionsGrid}>
              <div className={styles.actionItem}>
                <div className={styles.actionInfo}>
                  <Text variant="subtitle" style={{ marginBottom: 4 }}>Sign Out</Text>
                  <Text variant="body" color="muted">
                    Sign out of your account on this device
                  </Text>
                </div>
                <Button
                  variant="danger"
                  leftIcon={<FiLogOut />}
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
