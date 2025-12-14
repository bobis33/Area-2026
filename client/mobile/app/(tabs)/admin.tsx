import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Text } from '@area/ui';
import {
  MobileScreen,
  MobileButton,
  MobileInput,
} from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { Modal } from '@/components/layout/Modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AnimatedCard, FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { User } from '@/types/api';

type ModalType = 'action' | 'reaction' | null;

export default function AdminScreen() {
  const { currentTheme } = useAppTheme();
  const { token } = useAuth();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [actionName, setActionName] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [reactionName, setReactionName] = useState('');
  const [reactionDescription, setReactionDescription] = useState('');

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
      setError('Non authentifié');
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
          : 'Erreur lors du chargement des utilisateurs';
      setError(errorMessage);
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    if (type === 'action') {
      setActionName('');
      setActionDescription('');
    } else if (type === 'reaction') {
      setReactionName('');
      setReactionDescription('');
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
  };

  const handleSaveAction = () => {
    // TODO: Implement create action API call
    console.log('Create action - TODO', {
      name: actionName,
      description: actionDescription,
    });
    handleCloseModal();
  };

  const handleSaveReaction = () => {
    // TODO: Implement create reaction API call
    console.log('Create reaction - TODO', {
      name: reactionName,
      description: reactionDescription,
    });
    handleCloseModal();
  };

  const handleLinkActionReaction = () => {
    // TODO: Implement link action → reaction API call
    console.log('Link action → reaction - TODO');
  };

  const handlePromoteUser = async (userId: number) => {
    if (!token) {
      Alert.alert('Erreur', 'Non authentifié');
      return;
    }

    Alert.alert(
      'Promouvoir en admin',
      'Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Promouvoir',
          style: 'default',
          onPress: async () => {
            try {
              setUpdatingUserId(userId);
              await apiService.updateUser(userId, { role: 'admin' }, token);
              await loadUsers(); // Refresh the list
              Alert.alert('Succès', 'Utilisateur promu en administrateur');
            } catch (err) {
              const errorMessage =
                err instanceof Error
                  ? err.message
                  : 'Erreur lors de la promotion';
              Alert.alert('Erreur', errorMessage);
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
      Alert.alert('Erreur', 'Non authentifié');
      return;
    }

    Alert.alert(
      'Rétrograder en utilisateur',
      'Êtes-vous sûr de vouloir rétrograder cet administrateur en utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Rétrograder',
          style: 'default',
          onPress: async () => {
            try {
              setUpdatingUserId(userId);
              await apiService.updateUser(userId, { role: 'user' }, token);
              await loadUsers(); // Refresh the list
              Alert.alert('Succès', 'Administrateur rétrogradé en utilisateur');
            } catch (err) {
              const errorMessage =
                err instanceof Error
                  ? err.message
                  : 'Erreur lors de la rétrogradation';
              Alert.alert('Erreur', errorMessage);
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
      Alert.alert('Erreur', 'Non authentifié');
      return;
    }

    Alert.alert(
      "Révoquer l'accès",
      'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingUserId(userId);
              await apiService.deleteUser(userId, token);
              await loadUsers(); // Refresh the list
              Alert.alert('Succès', 'Utilisateur supprimé');
            } catch (err) {
              const errorMessage =
                err instanceof Error
                  ? err.message
                  : 'Erreur lors de la suppression';
              Alert.alert('Erreur', errorMessage);
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
            Admin
          </Text>
        </View>
      </FadeInView>

      {/* Manage Services Section */}
      <FadeInView delay={100} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Manage automations
          </Text>

          <FadeInView delay={150} spring>
            <AnimatedCard haptic onPress={() => handleOpenModal('action')}>
              <SectionCard>
                <View style={styles.actionHeader}>
                  <View
                    style={[
                      styles.actionIconContainer,
                      { backgroundColor: currentTheme.colors.primarySoft },
                    ]}
                  >
                    <IconSymbol
                      size={24}
                      name="plus.circle.fill"
                      color={currentTheme.colors.primary}
                    />
                  </View>
                  <View style={styles.actionContent}>
                    <Text variant="subtitle" style={styles.actionTitle}>
                      Create new Action
                    </Text>
                    <Text
                      variant="body"
                      color="muted"
                      style={styles.actionDescription}
                    >
                      Define a new action that can trigger reactions when it
                      occurs.
                    </Text>
                  </View>
                </View>
                <MobileButton
                  label="Create Action"
                  onPress={() => handleOpenModal('action')}
                  variant="primary"
                  fullWidth
                  style={styles.actionButton}
                />
              </SectionCard>
            </AnimatedCard>
          </FadeInView>

          <FadeInView delay={200} spring>
            <AnimatedCard haptic onPress={() => handleOpenModal('reaction')}>
              <SectionCard>
                <View style={styles.actionHeader}>
                  <View
                    style={[
                      styles.actionIconContainer,
                      { backgroundColor: currentTheme.colors.primarySoft },
                    ]}
                  >
                    <IconSymbol
                      size={24}
                      name="bolt.fill"
                      color={currentTheme.colors.primary}
                    />
                  </View>
                  <View style={styles.actionContent}>
                    <Text variant="subtitle" style={styles.actionTitle}>
                      Create new Reaction
                    </Text>
                    <Text
                      variant="body"
                      color="muted"
                      style={styles.actionDescription}
                    >
                      Define a new reaction that will be triggered by actions.
                    </Text>
                  </View>
                </View>
                <MobileButton
                  label="Create Reaction"
                  onPress={() => handleOpenModal('reaction')}
                  variant="primary"
                  fullWidth
                  style={styles.actionButton}
                />
              </SectionCard>
            </AnimatedCard>
          </FadeInView>

          <FadeInView delay={250} spring>
            <AnimatedCard haptic onPress={handleLinkActionReaction}>
              <SectionCard>
                <View style={styles.actionHeader}>
                  <View
                    style={[
                      styles.actionIconContainer,
                      { backgroundColor: currentTheme.colors.primarySoft },
                    ]}
                  >
                    <IconSymbol
                      size={24}
                      name="link"
                      color={currentTheme.colors.primary}
                    />
                  </View>
                  <View style={styles.actionContent}>
                    <Text variant="subtitle" style={styles.actionTitle}>
                      Link Action → Reaction
                    </Text>
                    <Text
                      variant="body"
                      color="muted"
                      style={styles.actionDescription}
                    >
                      Connect an action to a reaction to create an automation
                      scenario.
                    </Text>
                  </View>
                </View>
                <MobileButton
                  label="Link Action → Reaction"
                  onPress={handleLinkActionReaction}
                  variant="primary"
                  fullWidth
                  style={styles.actionButton}
                />
              </SectionCard>
            </AnimatedCard>
          </FadeInView>
        </View>
      </FadeInView>

      {/* Members & Roles Section */}
      <FadeInView delay={350} spring>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="subtitle" style={styles.sectionTitle}>
              Members & roles
            </Text>
            {!loading && (
              <MobileButton
                label="Refresh"
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
                  Chargement des utilisateurs...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text variant="body" color="danger" style={styles.errorText}>
                  {error}
                </Text>
                <MobileButton
                  label="Réessayer"
                  onPress={loadUsers}
                  variant="primary"
                  fullWidth
                  style={styles.retryButton}
                />
              </View>
            ) : users.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text variant="body" color="muted" style={styles.emptyText}>
                  Aucun utilisateur trouvé
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
                                ? 'Demoting...'
                                : 'Promoting...'
                              : user.role === 'admin'
                                ? 'Demote'
                                : 'Promote'
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
                              ? 'Deleting...'
                              : 'Revoke'
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

      {/* Create Action Modal */}
      <Modal
        visible={modalType === 'action'}
        onClose={handleCloseModal}
        title="Create new Action"
      >
        <View style={styles.modalContent}>
          <MobileInput
            label="Action name"
            value={actionName}
            onChangeText={setActionName}
            placeholder="e.g., New GitHub push"
          />
          <View style={styles.modalSpacing} />
          <MobileInput
            label="Description"
            value={actionDescription}
            onChangeText={setActionDescription}
            placeholder="Describe when this action occurs"
            multiline
          />
          <View style={styles.modalActions}>
            <MobileButton
              label="Cancel"
              onPress={handleCloseModal}
              variant="ghost"
              fullWidth
              style={styles.modalButton}
            />
            <MobileButton
              label="Save"
              onPress={handleSaveAction}
              variant="primary"
              fullWidth
              style={styles.modalButton}
              disabled={!actionName.trim() || !actionDescription.trim()}
            />
          </View>
        </View>
      </Modal>

      {/* Create Reaction Modal */}
      <Modal
        visible={modalType === 'reaction'}
        onClose={handleCloseModal}
        title="Create new Reaction"
      >
        <View style={styles.modalContent}>
          <MobileInput
            label="Reaction name"
            value={reactionName}
            onChangeText={setReactionName}
            placeholder="e.g., Send Discord message"
          />
          <View style={styles.modalSpacing} />
          <MobileInput
            label="Description"
            value={reactionDescription}
            onChangeText={setReactionDescription}
            placeholder="Describe what this reaction does"
            multiline
          />
          <View style={styles.modalActions}>
            <MobileButton
              label="Cancel"
              onPress={handleCloseModal}
              variant="ghost"
              fullWidth
              style={styles.modalButton}
            />
            <MobileButton
              label="Save"
              onPress={handleSaveReaction}
              variant="primary"
              fullWidth
              style={styles.modalButton}
              disabled={!reactionName.trim() || !reactionDescription.trim()}
            />
          </View>
        </View>
      </Modal>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 4,
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
  actionHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    marginBottom: 4,
  },
  actionDescription: {
    lineHeight: 20,
  },
  actionButton: {
    marginTop: 8,
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
  modalContent: {
    gap: 12,
  },
  modalSpacing: {
    height: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  modalButton: {
    flex: 1,
  },
});
