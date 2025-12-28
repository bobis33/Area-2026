import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { MobileText as Text } from '@/components/ui-mobile';
import { MobileScreen } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { Modal } from '@/components/layout/Modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MobileBadge } from '@/components/ui-mobile';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { AnimatedCard, FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { AreaModel } from '@/types/api';

interface Automation {
  id: string;
  name: string;
  action: string;
  reaction: string;
  actionService: string;
  reactionService: string;
  status: 'active' | 'inactive';
}

function areaToAutomation(area: AreaModel): Automation {
  const actionService = area.action?.service || 'unknown';
  const actionType = area.action?.type || 'unknown';
  const reactionService = area.reaction?.service || 'unknown';
  const reactionType = area.reaction?.type || 'unknown';

  return {
    id: area.id.toString(),
    name: area.name,
    action: `${actionService}.${actionType}`,
    reaction: `${reactionService}.${reactionType}`,
    actionService,
    reactionService,
    status: area.is_active ? 'active' : 'inactive',
  };
}

export default function AreaScreen() {
  const { currentTheme } = useAppTheme();
  const { token } = useAuth();
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const loadAreas = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const areas = await apiService.getAreas(token);
      const mappedAutomations = areas.map(areaToAutomation);
      setAutomations(mappedAutomations);
    } catch (error) {
      setAutomations([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  const loadProviders = useCallback(async () => {
    try {
      setLoadingProviders(true);
      const available = await apiService.getOAuthProviders();
      setAvailableProviders(available);
      if (token) {
        const linked = await apiService.getLinkedProviders(token);
        const normalizedLinked = linked.map((p) => String(p).toLowerCase());
        setLinkedProviders(normalizedLinked);
      } else {
        setLinkedProviders([]);
      }
    } catch (error) {
      setAvailableProviders([]);
      setLinkedProviders([]);
    } finally {
      setLoadingProviders(false);
    }
  }, [token]);

  useEffect(() => {
    loadAreas();
    loadProviders();
  }, [loadAreas, loadProviders]);
  useFocusEffect(
    useCallback(() => {
      loadAreas();
      loadProviders();
    }, [loadAreas, loadProviders])
  );

  const handleCreateArea = () => {
    router.push('/(tabs)/area/create');
  };

  const handleToggleActive = async (automation: Automation, e: any) => {
    e.stopPropagation();
    if (!token) return;

    const newStatus = automation.status === 'active' ? 'inactive' : 'active';
    const newIsActive = newStatus === 'active';
    setAutomations(prev =>
      prev.map(a =>
        a.id === automation.id
          ? { ...a, status: newStatus }
          : a
      )
    );
    setTogglingIds(prev => new Set(prev).add(automation.id));

    try {
      await apiService.updateArea(
        parseInt(automation.id),
        { is_active: newIsActive },
        token,
      );
      await loadAreas();
    } catch (error) {
      setAutomations(prev =>
        prev.map(a =>
          a.id === automation.id
            ? { ...a, status: automation.status }
            : a
        )
      );
    } finally {
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(automation.id);
        return next;
      });
    }
  };

  const handleDelete = async (automation: Automation, e: any) => {
    e.stopPropagation();
    if (!token) return;

    Alert.alert(
      'Delete automation',
      `Are you sure you want to delete "${automation.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setAutomations(prev => prev.filter(a => a.id !== automation.id));
            setDeletingIds(prev => new Set(prev).add(automation.id));
            try {
              await apiService.deleteArea(parseInt(automation.id), token);
              await loadAreas();
            } catch (error) {
              await loadAreas();
            } finally {
              setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(automation.id);
                return next;
              });
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <MobileScreen scroll safeArea keyboardAware={false}>
        {/* Header */}
        <FadeInView delay={0} spring>
          <View style={styles.header}>
            <Text variant="title" style={styles.title}>
              Your automations
            </Text>
            <Text variant="body" color="muted" style={styles.subtitle}>
              Create and manage your automation scenarios.
            </Text>
          </View>
        </FadeInView>

      {/* Connected Services Section */}
      {token && (
        <FadeInView delay={50} spring>
          <View style={styles.section}>
            <Text variant="subtitle" style={styles.sectionTitle}>
              Connected services
            </Text>
            <View style={styles.servicesList}>
              {loadingProviders ? (
                <View style={styles.emptyState}>
                  <Text variant="body" color="muted">
                    Loading services...
                  </Text>
                </View>
              ) : availableProviders.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text variant="body" color="muted">
                    No services available. Please check your backend configuration.
                  </Text>
                </View>
              ) : (
                availableProviders.map((provider, index) => {
                // Normalize provider names for comparison (lowercase)
                const normalizedProvider = String(provider).toLowerCase();
                const isConnected = linkedProviders.some(
                  (linked) => String(linked).toLowerCase() === normalizedProvider
                );
                return (
                  <FadeInView key={provider} delay={100 + index * 50} spring>
                    <AnimatedCard haptic>
                      <SectionCard>
                        <TouchableOpacity
                          style={styles.serviceRow}
                          activeOpacity={0.7}
                        >
                          <View style={styles.serviceLeft}>
                            <View
                              style={[
                                styles.serviceIconContainer,
                                {
                                  backgroundColor: currentTheme.colors.surfaceMuted,
                                },
                              ]}
                            >
                              <ServiceIcon
                                service={provider}
                                size={24}
                                color={
                                  isConnected
                                    ? currentTheme.colors.primary
                                    : currentTheme.colors.textMuted
                                }
                              />
                            </View>
                            <Text variant="body" style={styles.serviceName}>
                              {provider.charAt(0).toUpperCase() + provider.slice(1)}
                            </Text>
                          </View>
                          <MobileBadge
                            variant={isConnected ? 'connected' : 'paused'}
                            showDot
                          >
                            {isConnected ? 'Connected' : 'Not connected'}
                          </MobileBadge>
                        </TouchableOpacity>
                      </SectionCard>
                    </AnimatedCard>
                  </FadeInView>
                );
              })
            )}
          </View>
        </View>
      </FadeInView>
      )}

      {/* Scenarios Section */}
      <FadeInView delay={100} spring>
        <View style={styles.section}>
          <Text variant="subtitle" style={styles.sectionTitle}>
            Scenarios (Actions → Reactions)
          </Text>
          <View style={styles.automationsList}>
            {loading ? (
              <View style={styles.emptyState}>
                <Text variant="body" color="muted">
                  Loading…
                </Text>
              </View>
            ) : automations.length === 0 ? (
              <View style={styles.emptyState}>
                <Text variant="body" color="muted">
                  No automations yet. Create one to get started!
                </Text>
              </View>
            ) : (
              automations.map((automation, index) => (
                <FadeInView key={automation.id} delay={150 + index * 100} spring>
                  <AnimatedCard
                    haptic
                    onPress={() => setSelectedAutomation(automation)}>
                    <SectionCard>
                      <View style={styles.automationRow}>
                        <View style={styles.automationHeader}>
                          <Text variant="body" style={styles.automationName}>
                            {automation.name}
                          </Text>
                          <View style={styles.automationControls}>
                            <MobileBadge
                              variant={automation.status === 'active' ? 'active' : 'paused'}
                              showDot
                            >
                              {automation.status === 'active' ? 'Active' : 'Paused'}
                            </MobileBadge>
                            <TouchableOpacity
                              onPress={(e) => handleToggleActive(automation, e)}
                              disabled={togglingIds.has(automation.id)}
                              style={[
                                styles.toggleButton,
                                {
                                  opacity: togglingIds.has(automation.id) ? 0.5 : 1,
                                  borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                                  backgroundColor: automation.status === 'active'
                                    ? currentTheme.colors.surfaceMuted
                                    : currentTheme.colors.primarySoft,
                                },
                              ]}
                              activeOpacity={0.7}>
                              <Text
                                variant="caption"
                                style={[
                                  styles.toggleButtonText,
                                  {
                                    color: automation.status === 'active'
                                      ? currentTheme.colors.text
                                      : currentTheme.colors.primary,
                                  },
                                ] as any}>
                                {automation.status === 'active' ? 'Pause' : 'Resume'}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={(e) => handleDelete(automation, e)}
                              disabled={deletingIds.has(automation.id)}
                              style={[
                                styles.deleteButton,
                                {
                                  opacity: deletingIds.has(automation.id) ? 0.5 : 1,
                                  borderColor: currentTheme.colors.danger,
                                },
                              ]}
                              activeOpacity={0.7}>
                              <IconSymbol
                                name="trash"
                                size={16}
                                color={currentTheme.colors.danger}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={styles.automationFlow}>
                          <View style={styles.flowItem}>
                            <Text variant="caption" color="muted">
                              Action
                            </Text>
                            <Text variant="body" style={styles.flowText}>
                              {automation.action}
                            </Text>
                          </View>
                          <IconSymbol
                            size={20}
                            name="arrow.right"
                            color={currentTheme.colors.textMuted}
                          />
                          <View style={styles.flowItem}>
                            <Text variant="caption" color="muted">
                              Reaction
                            </Text>
                            <Text variant="body" style={styles.flowText}>
                              {automation.reaction}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </SectionCard>
                  </AnimatedCard>
                </FadeInView>
              ))
            )}
          </View>
        </View>
      </FadeInView>

      {/* Automation Details Modal */}
      <Modal
        visible={!!selectedAutomation}
        onClose={() => setSelectedAutomation(null)}
        title={selectedAutomation?.name}
      >
        {selectedAutomation && (
          <View style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Action Service
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.actionService}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Action Description
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.action}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Reaction Service
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.reactionService}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Reaction Description
              </Text>
              <Text variant="body" style={styles.modalValue}>
                {selectedAutomation.reaction}
              </Text>
            </View>
            <View style={styles.modalSection}>
              <Text variant="caption" color="muted" style={styles.modalLabel}>
                Status
              </Text>
              <MobileBadge
                variant={selectedAutomation.status === 'active' ? 'active' : 'inactive'}
                showDot
              >
                {selectedAutomation.status === 'active' ? 'Active' : 'Inactive'}
              </MobileBadge>
            </View>
          </View>
        )}
      </Modal>
      </MobileScreen>

      {/* Floating Create Button - Fixed position */}
      {token && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: currentTheme.colors.primary }]}
          onPress={handleCreateArea}
          activeOpacity={0.8}>
          <IconSymbol name="plus.circle.fill" size={26} color={currentTheme.colors.primaryOn} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  sectionTitle: {
    marginBottom: 12,
  },
  servicesList: {
    gap: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  serviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontWeight: '500',
  },
  automationsList: {
    gap: 12,
  },
  automationRow: {
    gap: 12,
  },
  automationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  automationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  automationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  toggleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  automationName: {
    fontWeight: '600',
    flex: 1,
  },
  automationFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  flowItem: {
    flex: 1,
    minWidth: 120,
    gap: 4,
  },
  flowText: {
    fontSize: 14,
  },
  modalContent: {
    gap: 12,
  },
  modalSection: {
    gap: 4,
  },
  modalLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  modalValue: {
    marginTop: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
