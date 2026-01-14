import { Link } from 'react-router-dom';
import { FiActivity, FiSettings, FiUser, FiInfo } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { PageLayout, PageHeader, ContentGrid, Card } from '@/components/ui';
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
              <h2 className={styles.cardTitle}>My Automations</h2>
              <p className={styles.cardDescription}>
                Create and manage your action-reaction automations. Connect
                services and build powerful workflows.
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
              <h2 className={styles.cardTitle}>Connected Services</h2>
              <p className={styles.cardDescription}>
                Link multiple providers like GitHub, Spotify, and Discord to
                unlock more automations.
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
              <h2 className={styles.cardTitle}>My Profile</h2>
              <p className={styles.cardDescription}>
                View and update your personal information, security settings,
                and account preferences.
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
              <h2 className={styles.cardTitle}>About AREA</h2>
              <p className={styles.cardDescription}>
                Discover available services, actions, and reactions. Learn how
                to make the most of AREA.
              </p>
              <span className={styles.cardArrow}>→</span>
            </div>
          </Card>
        </Link>
      </ContentGrid>

      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <Card padding="lg">
          <h3 className={styles.sectionTitle}>Account Information</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Role</span>
              <span className={styles.infoValue}>
                <span className={styles.roleBadge}>{user.role}</span>
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Provider</span>
              <span className={styles.infoValue}>
                {user.provider === 'local'
                  ? 'Email/Password'
                  : user.provider.charAt(0).toUpperCase() +
                    user.provider.slice(1)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Member since</span>
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
