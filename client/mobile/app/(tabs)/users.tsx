import { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  FlatList,
  Dimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn, Layout } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { User } from '@/types/api';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_MARGIN = 12;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);

export default function UsersScreen() {
  const { token, logout, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const primaryColor = useThemeColor({}, 'primary');
  const cardColor = useThemeColor({}, 'card');
  const textSecondary = useThemeColor({}, 'textSecondary');

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
      <Animated.View
        entering={FadeInDown.delay(index * 50).springify().damping(15)}
        layout={Layout.springify()}
        style={styles.cardWrapper}>
        <AnimatedCard
          style={
            isCurrentUser
              ? [styles.userCard, { borderWidth: 2, borderColor: primaryColor }]
              : styles.userCard
          }>
          <View style={styles.cardContent}>
            <View style={styles.userMainInfo}>
              <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                <ThemedText style={styles.avatarText}>{initials}</ThemedText>
              </View>
              <View style={styles.userTextInfo}>
                <View style={styles.nameRow}>
                  <ThemedText type="defaultSemiBold" style={styles.userName} numberOfLines={1}>
                    {item.name || item.email}
                  </ThemedText>
                  {isCurrentUser && (
                    <View style={[styles.currentUserBadge, { backgroundColor: primaryColor }]}>
                      <ThemedText style={styles.currentUserText}>Vous</ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText style={[styles.userEmail, { color: textSecondary }]} numberOfLines={1}>
                  {item.email}
                </ThemedText>
                <View style={styles.metaRow}>
                  <View style={[styles.roleBadge, { backgroundColor: primaryColor + '20' }]}>
                    <ThemedText style={[styles.roleText, { color: primaryColor }]}>
                      {item.role}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.userDate, { color: textSecondary }]}>
                    {formatDate(item.created_at)} • {formatTime(item.created_at)}
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </AnimatedCard>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <ThemedText type="title" style={styles.headerTitle}>
            Utilisateurs
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
            {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
          </ThemedText>
        </View>
      </View>
      <AnimatedButton
        onPress={logout}
        variant="outline"
        style={styles.logoutButton}>
        Se déconnecter
      </AnimatedButton>
    </Animated.View>
  );

  const renderEmpty = () => (
    <Animated.View entering={FadeIn} style={styles.emptyContainer}>
      <ThemedText style={styles.emptyIcon}>👥</ThemedText>
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        Aucun utilisateur
      </ThemedText>
      <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
        Aucun utilisateur n'a été trouvé dans la base de données.
      </ThemedText>
    </Animated.View>
  );

  const renderFooter = () => {
    if (users.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: textSecondary }]}>
          Fin de la liste
        </ThemedText>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.centerContainer}>
          <Animated.View entering={FadeIn}>
            <ActivityIndicator size="large" color={primaryColor} />
            <ThemedText style={[styles.loadingText, { color: textSecondary }]}>
              Chargement des utilisateurs...
            </ThemedText>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
        <View style={styles.centerContainer}>
          <Animated.View entering={FadeIn} style={styles.errorContainer}>
            <ThemedText style={styles.errorIcon}>⚠️</ThemedText>
            <ThemedText type="subtitle" style={styles.errorTitle}>
              Erreur de chargement
            </ThemedText>
            <ThemedText style={[styles.errorText, { color: textSecondary }]}>
              {error}
            </ThemedText>
            <View style={styles.errorActions}>
              <AnimatedButton
                onPress={fetchUsers}
                variant="primary"
                style={styles.retryButton}>
                Réessayer
              </AnimatedButton>
              <AnimatedButton
                onPress={logout}
                variant="outline"
                style={styles.logoutButtonError}>
                Se déconnecter
              </AnimatedButton>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
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
            tintColor={primaryColor}
            colors={[primaryColor]}
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 120,
          offset: 120 * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  header: {
    paddingHorizontal: CARD_PADDING,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  cardWrapper: {
    paddingHorizontal: CARD_PADDING,
    marginBottom: CARD_MARGIN,
  },
  userCard: {
    width: CARD_WIDTH,
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
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
  userName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    minWidth: 0,
  },
  currentUserBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentUserText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
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
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  userDate: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
  },
  errorContainer: {
    alignItems: 'center',
    gap: 16,
    maxWidth: 300,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  errorActions: {
    gap: 12,
    width: '100%',
    marginTop: 8,
  },
  retryButton: {
    minWidth: 150,
  },
  logoutButtonError: {
    minWidth: 150,
  },
});
