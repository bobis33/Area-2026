import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  MobileText as Text,
  MobileScreen,
  MobileButton,
} from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { apiService } from '@/services/api.service';
import { User } from '@/types/api';

export default function AdminScreen() {
  const { currentTheme } = useAppTheme();
  const { token, user } = useAuth();
  const t = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/(tabs)');
      return;
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!token) {
      setError(t('admin.notAuthenticated'));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const usersData = await apiService.getUsers(token);
      setUsers(usersData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('admin.errorLoadingUsers');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async (userId: number) => {
    if (!token) {
      Alert.alert(t('common.error'), t('admin.notAuthenticated'));
      return;
    }

    Alert.alert(
      t('admin.promoteToAdmin'),
      t('admin.promoteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('admin.promote'),
          style: 'default',
          onPress: async () => {
            try {
              setUpdatingUserId(userId);
              await apiService.updateUser(userId, { role: 'admin' }, token);
              await loadUsers(); // Refresh the list
              Alert.alert(t('common.success'), t('admin.promoteSuccess'));
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : t('admin.promoteError');
              Alert.alert(t('common.error'), errorMessage);
            } finally {
              setUpdatingUserId(null);
            }
          },
        },
      ],
    );
  };

  const handleDemoteUser = async (userId: number) => {
    if (!token) {
      Alert.alert(t('common.error'), t('admin.notAuthenticated'));
      return;
    }

    Alert.alert(
      t('admin.demoteToUser'),
      t('admin.demoteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('admin.demote'),
          style: 'default',
          onPress: async () => {
            try {
              setUpdatingUserId(userId);
              await apiService.updateUser(userId, { role: 'user' }, token);
              await loadUsers(); // Refresh the list
              Alert.alert(t('common.success'), t('admin.demoteSuccess'));
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : t('admin.demoteError');
              Alert.alert(t('common.error'), errorMessage);
            } finally {
              setUpdatingUserId(null);
            }
          },
        },
      ],
    );
  };

  const handleRevokeUser = async (userId: number) => {
    if (!token) {
      Alert.alert(t('common.error'), t('admin.notAuthenticated'));
      return;
    }

    Alert.alert(
      t('admin.deleteUser'),
      t('admin.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingUserId(userId);
              await apiService.deleteUser(userId, token);
              await loadUsers(); // Refresh the list
              Alert.alert(t('common.success'), t('admin.deleteSuccess'));
            } catch (err) {
              const errorMessage =
                err instanceof Error ? err.message : t('admin.deleteError');
              Alert.alert(t('common.error'), errorMessage);
            } finally {
              setDeletingUserId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <MobileScreen scroll safeArea keyboardAware={false}>
      {/* Header */}
      <FadeInView delay={0} spring>
        <View style={styles.header}>
          <Text variant="title" style={styles.title}>
            {t('admin.title')}
          </Text>
          <Text variant="body" color="muted" style={styles.subtitle}>
            {t('admin.users')}
          </Text>
        </View>
      </FadeInView>

      {/* Members & Roles Section */}
      <FadeInView delay={350} spring>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="subtitle" style={styles.sectionTitle}>
              {t('admin.users')}
            </Text>
            {!loading && (
              <MobileButton
                label={t('admin.refresh')}
                onPress={loadUsers}
                variant="ghost"
                style={styles.refreshButton}
              />
            )}
          </View>
          <SectionCard>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={currentTheme.colors.primary}
                />
                <Text variant="body" color="muted" style={styles.loadingText}>
                  {t('admin.loadingUsers')}
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text variant="body" color="danger" style={styles.errorText}>
                  {error}
                </Text>
                <MobileButton
                  label={t('admin.retry')}
                  onPress={loadUsers}
                  variant="primary"
                  fullWidth
                  style={styles.retryButton}
                />
              </View>
            ) : users.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text variant="body" color="muted" style={styles.emptyText}>
                  {t('admin.noUsersFound')}
                </Text>
              </View>
            ) : (
              users.map((user, index) => (
                <FadeInView key={user.id} delay={400 + index * 50} spring>
                  <View
                    style={[
                      styles.memberRow,
                      index < users.length - 1 && {
                        borderBottomColor: currentTheme.colors.border,
                      },
                    ]}
                  >
                    <View style={styles.memberInfo}>
                      <Text variant="body" style={styles.memberName}>
                        {user.name || user.email}
                      </Text>
                      <Text variant="caption" color="muted">
                        {user.email}
                      </Text>
                    </View>
                    <View style={styles.memberMeta}>
                      <View
                        style={[
                          styles.roleBadge,
                          user.role === 'admin'
                            ? {
                                backgroundColor:
                                  currentTheme.colors.primarySoft,
                              }
                            : {
                                backgroundColor:
                                  currentTheme.colors.surfaceMuted,
                              },
                        ]}
                      >
                        <Text variant="caption" style={styles.roleText}>
                          {user.role}
                        </Text>
                      </View>
                      <View style={styles.memberActions}>
                        <MobileButton
                          label={
                            updatingUserId === user.id
                              ? user.role === 'admin'
                                ? t('admin.demoting')
                                : t('admin.promoting')
                              : user.role === 'admin'
                                ? t('admin.demote')
                                : t('admin.promote')
                          }
                          onPress={() =>
                            user.role === 'admin'
                              ? handleDemoteUser(user.id)
                              : handlePromoteUser(user.id)
                          }
                          variant="ghost"
                          disabled={
                            updatingUserId === user.id ||
                            deletingUserId === user.id
                          }
                          style={styles.memberButton}
                        />
                        <MobileButton
                          label={
                            deletingUserId === user.id
                              ? t('admin.deleting')
                              : t('admin.revoke')
                          }
                          onPress={() => handleRevokeUser(user.id)}
                          variant="ghost"
                          disabled={
                            deletingUserId === user.id ||
                            updatingUserId === user.id
                          }
                          style={styles.memberButton}
                        />
                      </View>
                    </View>
                  </View>
                </FadeInView>
              ))
            )}
          </SectionCard>
        </View>
      </FadeInView>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    flex: 1,
  },
  refreshButton: {
    marginLeft: 12,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    padding: 24,
    gap: 12,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  memberRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberInfo: {
    flex: 1,
    gap: 4,
    marginBottom: 8,
  },
  memberName: {
    fontWeight: '600',
  },
  memberMeta: {
    gap: 8,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    textTransform: 'capitalize',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  memberButton: {
    flex: 1,
  },
});
