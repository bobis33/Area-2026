import { Link } from 'react-router-dom';
import { FiActivity, FiSettings, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout, PageHeader, ContentGrid, Card, Text } from '@/components/ui';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title={`Welcome back, ${user.name || user.email}!`}
        subtitle="Manage your automations and account from here"
      />

      <ContentGrid columns={2} gap="lg">
        <Link to="/area" className={styles.cardLink}>
          <Card padding="lg" hoverable>
            <div className={styles.cardContent}>
              <div className={styles.cardIcon}>
                <FiActivity />
              </div>
              <Text variant="subtitle" style={{ marginBottom: 8 }}>My Automations</Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                Create and manage your action-reaction automations. Connect
                services and build powerful workflows.
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
              <Text variant="subtitle" style={{ marginBottom: 8 }}>Connected Services</Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                Link multiple providers like GitHub, Spotify, and Discord to
                unlock more automations.
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
              <Text variant="subtitle" style={{ marginBottom: 8 }}>My Profile</Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                View and update your personal information, security settings,
                and account preferences.
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
              <Text variant="subtitle" style={{ marginBottom: 8 }}>About AREA</Text>
              <Text variant="body" color="muted" style={{ marginBottom: 8 }}>
                Discover available services, actions, and reactions. Learn how
                to make the most of AREA.
              </Text>
              <Text variant="caption">→</Text>
            </div>
          </Card>
        </Link>
      </ContentGrid>

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <Card padding="lg">
          <div style={{ marginBottom: 16 }}>
            <Text variant="subtitle">Account Information</Text>
          </div>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">Email</Text>
              <Text variant="body">{user.email}</Text>
            </div>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">Role</Text>
              <Text variant="caption" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: 'var(--color-surface-muted)' }}>
                {user.role}
              </Text>
            </div>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">Provider</Text>
              <Text variant="body">
                {user.provider === 'local'
                  ? 'Email/Password'
                  : user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)}
              </Text>
            </div>
            <div className={styles.infoItem}>
              <Text variant="caption" color="muted">Member since</Text>
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
