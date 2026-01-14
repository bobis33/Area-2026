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
              <h2 className={styles.sectionTitle}>Personal Information</h2>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiUser />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Name</span>
                  <span className={styles.infoValue}>
                    {user.name || 'Not set'}
                  </span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiMail />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiShield />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Role</span>
                  <span className={styles.roleBadge}>{user.role}</span>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiKey />
                </div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>
                    Authentication Provider
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
                  <span className={styles.infoLabel}>Account Created</span>
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
                <span className={styles.statLabel}>Account Status</span>
                <span className={styles.statValue}>Active</span>
              </div>
            </div>
          </Card>

          <Card padding="lg" className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statIcon}>
                <FiCalendar />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>Member Since</span>
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
              <h2 className={styles.sectionTitle}>Account Actions</h2>
            </div>

            <div className={styles.actionsGrid}>
              <div className={styles.actionItem}>
                <div className={styles.actionInfo}>
                  <h3 className={styles.actionTitle}>Sign Out</h3>
                  <p className={styles.actionDescription}>
                    Sign out of your account on this device
                  </p>
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
