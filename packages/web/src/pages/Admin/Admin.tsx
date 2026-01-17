import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { get, put, del } from '@/services/api.ts';
import {
  FiUsers,
  FiTrash,
  FiRefreshCw,
  FiChevronUp,
  FiChevronDown,
  FiShield,
  FiUser,
  FiMail,
  FiKey,
  FiCalendar,
} from 'react-icons/fi';
import { useTranslation } from '@/contexts/I18nContext';
import { PageLayout, PageHeader, Card, Button } from '@/components/ui';
import styles from './Admin.module.css';

interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  provider: string;
  created_at: string;
}

export default function Admin() {
  const { user } = useAuth();
  const t = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Check if user is admin (specific email)
  if (user?.email !== 'areaserveur825@gmail.com') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const usersData = await get<User[]>('/users', token);
      setUsers(usersData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId: number) => {
    if (!window.confirm(t('admin.confirmations.promote'))) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await put(`/users/${userId}`, { role: 'admin' }, token);
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to promote user';
      setError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDemoteUser = async (userId: number) => {
    if (!window.confirm(t('admin.confirmations.demote'))) {
      return;
    }

    try {
      setUpdatingUserId(userId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await put(`/users/${userId}`, { role: 'user' }, token);
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to demote user';
      setError(errorMessage);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRevokeUser = async (userId: number) => {
    if (!window.confirm(t('admin.confirmations.delete'))) {
      return;
    }

    try {
      setDeletingUserId(userId);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await del(`/users/${userId}`, token);
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
    } finally {
      setDeletingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <PageLayout maxWidth="xl">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>{t('admin.users.loadingUsers')}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title={t('admin.title')}
        subtitle={t('admin.subtitle')}
        action={
          <Button
            variant="secondary"
            leftIcon={<FiRefreshCw />}
            onClick={loadUsers}
            disabled={loading}
          >
            {t('common.refresh')}
          </Button>
        }
      />

      {error && (
        <div className={styles.errorBanner}>
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            {t('common.close')}
          </Button>
        </div>
      )}

      {/* Users Section */}
      <Card padding="lg">
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>
              <FiUsers />
            </div>
            <h2 className={styles.sectionTitle}>{t('admin.users.title')}</h2>
            <span className={styles.sectionBadge}>
              {users.length}{' '}
              {users.length === 1
                ? t('admin.users.user')
                : t('admin.users.users')}
            </span>
          </div>

          {users.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiUsers />
              </div>
              <h3 className={styles.emptyTitle}>{t('admin.users.noUsers')}</h3>
              <p className={styles.emptyText}>
                {t('admin.users.noUsersDescription')}
              </p>
            </div>
          ) : (
            <div className={styles.usersGrid}>
              {users.map((u) => (
                <Card key={u.id} padding="md" hoverable>
                  <div className={styles.userCard}>
                    <div className={styles.userHeader}>
                      <div className={styles.userIcon}>
                        {u.role === 'admin' ? <FiShield /> : <FiUser />}
                      </div>
                      <div className={styles.userInfo}>
                        <h3 className={styles.userName}>
                          {u.name || t('profile.notSet')}
                        </h3>
                        <span
                          className={`${styles.roleBadge} ${
                            u.role === 'admin'
                              ? styles.roleBadgeAdmin
                              : styles.roleBadgeUser
                          }`}
                        >
                          {u.role === 'admin' ? (
                            <>
                              <FiShield /> {t('admin.users.admin')}
                            </>
                          ) : (
                            <>
                              <FiUser /> {t('admin.users.user')}
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className={styles.userDetails}>
                      <div className={styles.userDetailItem}>
                        <FiMail />
                        <span>{u.email}</span>
                      </div>
                      <div className={styles.userDetailItem}>
                        <FiKey />
                        <span>{u.provider}</span>
                      </div>
                      <div className={styles.userDetailItem}>
                        <FiCalendar />
                        <span>{formatDate(u.created_at)}</span>
                      </div>
                    </div>

                    {u.id !== user?.id && (
                      <div className={styles.userActions}>
                        {u.role === 'user' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            leftIcon={<FiChevronUp />}
                            onClick={() => handlePromoteUser(u.id)}
                            disabled={updatingUserId === u.id}
                            loading={updatingUserId === u.id}
                          >
                            {t('admin.actions.promote')}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            leftIcon={<FiChevronDown />}
                            onClick={() => handleDemoteUser(u.id)}
                            disabled={updatingUserId === u.id}
                            loading={updatingUserId === u.id}
                          >
                            {t('admin.actions.demote')}
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          fullWidth
                          leftIcon={<FiTrash />}
                          onClick={() => handleRevokeUser(u.id)}
                          disabled={deletingUserId === u.id}
                          loading={deletingUserId === u.id}
                        >
                          {t('admin.actions.delete')}
                        </Button>
                      </div>
                    )}

                    {u.id === user?.id && (
                      <div className={styles.currentUserBadge}>
                        <FiShield />
                        <span>{t('admin.currentUser')}</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </PageLayout>
  );
}
