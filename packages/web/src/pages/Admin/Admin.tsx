import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { get, put, del } from '@/services/api.ts';
import { useTranslation } from '@/contexts/I18nContext';
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
import { PageLayout, PageHeader, Card, Button, Text } from '@/components/ui';
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
      await put(`/users/${userId}`, { role: 'ADMIN' }, token);
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
      await put(`/users/${userId}`, { role: 'USER' }, token);
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
    if (
      !window.confirm(
        'Are you sure you want to delete this user? This action cannot be undone.',
      )
    ) {
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
          <Text variant="body" color="muted">
            Loading users...
          </Text>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth="xl">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users and their roles"
        action={
          <Button
            variant="secondary"
            leftIcon={<FiRefreshCw />}
            onClick={loadUsers}
            disabled={loading}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <div className={styles.errorBanner}>
          <Text variant="body" color="danger">
            {error}
          </Text>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
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
            <Text variant="subtitle" style={{ margin: 0 }}>
              Members & Roles
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
              {users.length} {users.length === 1 ? 'User' : 'Users'}
            </Text>
          </div>

          {users.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FiUsers />
              </div>
              <div style={{ marginBottom: 8 }}>
                <Text variant="subtitle">No users yet</Text>
              </div>
              <Text variant="body" color="muted">
                No users are registered in the system.
              </Text>
            </div>
          ) : (
            <div className={styles.usersGrid}>
              {users.map((u) => (
                <Card key={u.id} padding="md" hoverable>
                  <div className={styles.userCard}>
                    <div className={styles.userHeader}>
                      <div className={styles.userIcon}>
                        {u.role === 'ADMIN' ? <FiShield /> : <FiUser />}
                      </div>
                      <div className={styles.userInfo}>
                        <Text variant="subtitle" style={{ margin: 0 }}>
                          {u.name || 'No name'}
                        </Text>
                        <span
                          className={`${styles.roleBadge} ${
                            u.role === 'ADMIN'
                              ? styles.roleBadgeAdmin
                              : styles.roleBadgeUser
                          }`}
                        >
                          {u.role === 'ADMIN' ? (
                            <>
                              <FiShield /> Admin
                            </>
                          ) : (
                            <>
                              <FiUser /> User
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
                        {u.role === 'USER' ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            leftIcon={<FiChevronUp />}
                            onClick={() => handlePromoteUser(u.id)}
                            disabled={updatingUserId === u.id}
                            loading={updatingUserId === u.id}
                          >
                            Promote to Admin
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
                            Demote to User
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
                          Delete User
                        </Button>
                      </div>
                    )}

                    {u.id === user?.id && (
                      <div className={styles.currentUserBadge}>
                        <FiShield />
                        <span>You (Current User)</span>
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
