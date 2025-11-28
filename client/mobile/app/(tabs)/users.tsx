import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  FlatList,
  View,
  StyleSheet,
} from 'react-native';
import { Text, Card } from '@area/ui';
import {
  MobileScreen,
  MobileButton,
} from '@/components/ui-mobile';

import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { User } from '@/types/api';

export default function UsersScreen() {
  const { token, logout, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    if (!token) {
      setError('Non authentifié');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await apiService.getUsers(token);
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUsers();
  }, [token]);

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string, email: string): string => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name[0].toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const renderUserCard = ({ item, index }: { item: User; index: number }) => {
    const isCurrentUser = currentUser?.id === item.id;
    const initials = getInitials(item.name || '', item.email);

    return (
      <Card
        padding="md"
        elevated={true}
        border={isCurrentUser}
        style={styles.userCardWrapper}>
          <View style={styles.cardContent}>
            <View style={styles.userMainInfo}>
              <View style={styles.avatar}>
                <Text variant="body">
                  {initials}
                </Text>
              </View>
              <View style={styles.userTextInfo}>
                <View style={styles.nameRow}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="body" numberOfLines={1}>
                      {item.name || item.email}
                    </Text>
                  </View>
                  {isCurrentUser && (
                    <View style={styles.currentUserBadge}>
                      <Text variant="caption">
                        Vous
                      </Text>
                    </View>
                  )}
                </View>
                <Text variant="caption" color="muted" numberOfLines={1}>
                  {item.email}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.roleBadge}>
                    <Text variant="caption">
                      {item.role}
                    </Text>
                  </View>
                  <Text variant="caption" color="muted">
                    {formatDate(item.created_at)} • {formatTime(item.created_at)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Card>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text variant="title" style={{ marginBottom: 4 }}>
          Utilisateurs
        </Text>
        <Text variant="body" color="muted">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
        </Text>
      </View>
      <MobileButton
        label="Se déconnecter"
        onPress={logout}
        variant="ghost"
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="title" style={{ marginBottom: 8 }}>👥</Text>
      <Text variant="subtitle" style={{ marginBottom: 8 }}>
        Aucun utilisateur
      </Text>
      <Text variant="body" color="muted" align="center">
        Aucun utilisateur n'a été trouvé dans la base de données.
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (users.length === 0) return null;
    return (
      <View style={styles.footer}>
        <Text variant="caption" color="muted">
          Fin de la liste
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <MobileScreen title="Utilisateurs" safeArea={true} keyboardAware={false}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text variant="body" color="muted" style={{ marginTop: 16 }}>
            Chargement des utilisateurs...
          </Text>
        </View>
      </MobileScreen>
    );
  }

  if (error) {
    return (
      <MobileScreen title="Utilisateurs" safeArea={true} keyboardAware={false}>
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <Text variant="title" style={{ marginBottom: 8 }}>⚠️</Text>
            <Text variant="subtitle" align="center" style={{ marginBottom: 8 }}>
              Erreur de chargement
            </Text>
            <Text variant="body" color="muted" align="center" style={{ marginBottom: 8 }}>
              {error}
            </Text>
            <View style={styles.errorActions}>
              <MobileButton
                label="Réessayer"
                onPress={fetchUsers}
                variant="primary"
                fullWidth
              />
              <MobileButton
                label="Se déconnecter"
                onPress={logout}
                variant="ghost"
                fullWidth
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        </View>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen
      title="Utilisateurs"
      safeArea={true}
      scroll={false}
      keyboardAware={false}>
      <FlatList
        data={users}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[
          styles.listContent,
          users.length === 0 && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  userCardWrapper: {
    marginBottom: 12,
  },
  cardContent: {
    gap: 12,
  },
  userMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userTextInfo: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  currentUserBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#6366f1',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#6366f120',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    gap: 16,
    maxWidth: 300,
  },
  errorActions: {
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
});
