import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { MobileText as Text } from '@/components/ui-mobile';
import { Modal } from '@/components/layout/Modal';
import { useAppTheme } from '@/contexts/ThemeContext';
import {
  AreaActionDefinition,
  AreaReactionDefinition,
} from '@/types/api';
import { makeKey } from '@/utils/areaHelpers';
import { ModalStep, SelectionKind } from '@/hooks/useAreaCreation';
import { borderRadius, spacing } from '@area/ui';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FadeInView, AnimatedServiceCard } from '@/components/animations';
import * as Haptics from 'expo-haptics';

/**
 * Get brand colors for a service
 */
const getServiceBrandColors = (service: string): { 
  backgroundColor: string; 
  borderColor: string;
  iconColor: string;
} => {
  const serviceLower = service.toLowerCase();
  
  switch (serviceLower) {
    case 'discord':
      return {
        backgroundColor: '#5865F2', // Discord blue
        borderColor: '#5865F2',
        iconColor: '#FFFFFF',
      };
    case 'spotify':
      return {
        backgroundColor: '#1DB954',
        borderColor: '#1DB954',
        iconColor: '#FFFFFF',
      };
    case 'gitlab':
      return {
        backgroundColor: '#FC6D26',
        borderColor: '#FC6D26',
        iconColor: '#FFFFFF',
      };
    case 'github':
      return {
        backgroundColor: '#18181B',
        borderColor: '#18181B',
        iconColor: '#FFFFFF',
      };
    case 'google':
      return {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E2E3',
        iconColor: '#222120',
      };
    default:
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        iconColor: 'transparent',
      };
  }
};

interface SelectionModalProps {
  visible: boolean;
  onClose: () => void;
  modalStep: ModalStep;
  selectionKind: SelectionKind;
  selectedActionService: string | null;
  selectedReactionService: string | null;
  actionsByService: Record<string, AreaActionDefinition[]>;
  reactionsByService: Record<string, AreaReactionDefinition[]>;
  availableProviders?: string[];
  onServiceSelect: (service: string) => void;
  onActionSelect: (action: AreaActionDefinition) => void;
  onReactionSelect: (reaction: AreaReactionDefinition) => void;
  onBack: () => void;
}

export function SelectionModal({
  visible,
  onClose,
  modalStep,
  selectionKind,
  selectedActionService,
  selectedReactionService,
  actionsByService,
  reactionsByService,
  availableProviders = [],
  onServiceSelect,
  onActionSelect,
  onReactionSelect,
  onBack,
}: SelectionModalProps) {
  const { currentTheme } = useAppTheme();

  const sortServices = (services: string[]): string[] => {
    const normalizedProviders = availableProviders.map(p => String(p).toLowerCase());
    const oauthServices: string[] = [];
    const systemServices: string[] = [];
    
    services.forEach(service => {
      const normalized = String(service).toLowerCase();
      if (normalizedProviders.includes(normalized)) {
        oauthServices.push(service);
      } else {
        systemServices.push(service);
      }
    });
    oauthServices.sort((a, b) => a.localeCompare(b));
    systemServices.sort((a, b) => a.localeCompare(b));
    return [...oauthServices, ...systemServices];
  };

  const renderContent = () => {
    if (modalStep === 'service') {
      let servicesFromData =
        selectionKind === 'action'
          ? Object.keys(actionsByService)
          : Object.keys(reactionsByService);
      if (selectionKind === 'action') {
        servicesFromData = servicesFromData.filter(s => s.toLowerCase() !== 'time');
      }
      const allServicesSet = new Set([
        ...servicesFromData,
        ...availableProviders.map(p => String(p).toLowerCase()),
      ]);
      const servicesForMode = sortServices(Array.from(allServicesSet));

      return (
        <View style={styles.container}>
          {servicesForMode.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="body" color="muted" style={styles.emptyText}>
                No {selectionKind === 'action' ? 'actions' : 'reactions'} available.
              </Text>
            </View>
          ) : (
            <View style={styles.servicesGrid}>
              {servicesForMode.map((service) => {
                let count = 0;
                if (selectionKind === 'action') {
                  if (service.toLowerCase() === 'discord') {
                    count = (actionsByService['discord']?.length ?? 0) + (actionsByService['time']?.length ?? 0);
                  } else {
                    count = (actionsByService[service]?.length ?? 0);
                  }
                } else {
                  count = (reactionsByService[service]?.length ?? 0);
                }

                const serviceName = service.charAt(0).toUpperCase() + service.slice(1);
                const hasActionsOrReactions = count > 0;
                const brandColors = getServiceBrandColors(service);
                const isBrandedService = brandColors.backgroundColor !== 'transparent';
                const index = servicesForMode.indexOf(service);

                return (
                  <FadeInView
                    key={service}
                    delay={index * 50}
                    spring={true}
                    fromY={15}
                  >
                    <AnimatedServiceCard
                      delay={index * 50}
                      haptic={hasActionsOrReactions}
                      glowColor={isBrandedService ? brandColors.backgroundColor : undefined}
                      style={[
                        styles.serviceCard,
                        {
                          backgroundColor: currentTheme.colors.surfaceMuted,
                          borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                          opacity: hasActionsOrReactions ? 1 : 0.6,
                        },
                      ]}
                      onPress={() => {
                        if (hasActionsOrReactions) {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          onServiceSelect(service);
                        }
                      }}
                      disabled={!hasActionsOrReactions}
                    >
                    <View
                      style={[
                        styles.serviceIconContainer,
                        {
                          backgroundColor: isBrandedService 
                            ? brandColors.backgroundColor 
                            : currentTheme.colors.surface,
                        },
                      ]}
                    >
                      <ServiceIcon
                        service={service}
                        size={26}
                        color={isBrandedService 
                          ? brandColors.iconColor 
                          : currentTheme.colors.primary}
                      />
                    </View>
                    <Text variant="body" style={styles.serviceName}>
                      {serviceName}
                    </Text>
                    <Text variant="caption" color="muted" style={styles.serviceCount}>
                      {count > 0 
                        ? `${count} ${count === 1 ? (selectionKind === 'action' ? 'action' : 'reaction') : (selectionKind === 'action' ? 'actions' : 'reactions')}`
                        : 'No ' + (selectionKind === 'action' ? 'actions' : 'reactions')
                      }
                    </Text>
                  </AnimatedServiceCard>
                  </FadeInView>
                );
              })}
            </View>
          )}
        </View>
      );
    }

    if (modalStep === 'action' && selectedActionService) {
      let serviceActions: AreaActionDefinition[] = [];
      if (selectedActionService.toLowerCase() === 'discord') {
        serviceActions = [
          ...(actionsByService['discord'] || []),
          ...(actionsByService['time'] || []),
        ];
      } else {
        serviceActions = actionsByService[selectedActionService] || [];
      }
      serviceActions = serviceActions.sort((a, b) => {
        return String(a.type).localeCompare(String(b.type));
      });

      return (
        <View style={styles.container}>
          <FadeInView delay={0} spring={true} fromY={10}>
            <AnimatedServiceCard
              haptic={true}
              style={[
                styles.backButton,
                {
                  backgroundColor: currentTheme.colors.surfaceMuted,
                  borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onBack();
              }}
            >
              <View style={styles.backButtonContent}>
                <IconSymbol
                  name="chevron.left"
                  size={20}
                  color={currentTheme.colors.primary}
                />
                <Text variant="body">
                  Back to services
                </Text>
              </View>
            </AnimatedServiceCard>
          </FadeInView>
          <View style={styles.spacer} />
          {serviceActions.length === 0 ? (
            <Text variant="body" color="muted">
              No actions available for {selectedActionService}.
            </Text>
          ) : (
            <View style={styles.listContainer}>
              {serviceActions.map((action, index) => {
                const key = makeKey(action.service, action.type);
                const actionName = action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <FadeInView
                    key={key}
                    delay={index * 30}
                    spring={true}
                    fromY={10}
                  >
                    <AnimatedServiceCard
                      delay={index * 30}
                      haptic={true}
                      style={[
                        styles.actionReactionRow,
                        {
                          backgroundColor: currentTheme.colors.surfaceMuted,
                          borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onActionSelect(action);
                      }}
                    >
                    <View style={styles.actionReactionContent}>
                      <View
                        style={[
                          styles.actionReactionIconContainer,
                          {
                            backgroundColor: currentTheme.colors.surface,
                          },
                        ]}
                      >
                        <IconSymbol
                          name="arrow.right"
                          size={20}
                          color={currentTheme.colors.primary}
                        />
                      </View>
                      <View style={styles.actionReactionTextContainer}>
                        <Text variant="body" style={styles.actionReactionName}>
                          {actionName}
                        </Text>
                      </View>
                    </View>
                  </AnimatedServiceCard>
                  </FadeInView>
                );
              })}
            </View>
          )}
        </View>
      );
    }

    if (modalStep === 'reaction' && selectedReactionService) {
      const serviceReactions = reactionsByService[selectedReactionService] || [];

      return (
        <View style={styles.container}>
          <FadeInView delay={0} spring={true} fromY={10}>
            <AnimatedServiceCard
              haptic={true}
              style={[
                styles.backButton,
                {
                  backgroundColor: currentTheme.colors.surfaceMuted,
                  borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onBack();
              }}
            >
              <View style={styles.backButtonContent}>
                <IconSymbol
                  name="chevron.left"
                  size={20}
                  color={currentTheme.colors.primary}
                />
                <Text variant="body">
                  Back to services
                </Text>
              </View>
            </AnimatedServiceCard>
          </FadeInView>
          <View style={styles.spacer} />
          {serviceReactions.length === 0 ? (
            <Text variant="body" color="muted">
              No reactions available for {selectedReactionService}.
            </Text>
          ) : (
            <View style={styles.listContainer}>
              {serviceReactions.map((reaction, index) => {
                const key = makeKey(reaction.service, reaction.type);
                const reactionName = reaction.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                  <FadeInView
                    key={key}
                    delay={index * 30}
                    spring={true}
                    fromY={10}
                  >
                    <AnimatedServiceCard
                      delay={index * 30}
                      haptic={true}
                      style={[
                        styles.actionReactionRow,
                        {
                          backgroundColor: currentTheme.colors.surfaceMuted,
                          borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                        },
                      ]}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onReactionSelect(reaction);
                      }}
                    >
                    <View style={styles.actionReactionContent}>
                      <View
                        style={[
                          styles.actionReactionIconContainer,
                          {
                            backgroundColor: currentTheme.colors.surface,
                          },
                        ]}
                      >
                        <IconSymbol
                          name="arrow.right"
                          size={20}
                          color={currentTheme.colors.primary}
                        />
                      </View>
                      <View style={styles.actionReactionTextContainer}>
                        <Text variant="body" style={styles.actionReactionName}>
                          {reactionName}
                        </Text>
                      </View>
                    </View>
                  </AnimatedServiceCard>
                  </FadeInView>
                );
              })}
            </View>
          )}
        </View>
      );
    }

    return (
      <Text variant="body" color="muted">
        Nothing to display (step={modalStep}).
      </Text>
    );
  };

  const getTitle = () => {
    if (modalStep === 'service') {
      return `Choose ${selectionKind === 'action' ? 'action' : 'reaction'} service`;
    }
    if (modalStep === 'action') {
      return `Choose action from ${selectedActionService}`;
    }
    return `Choose reaction from ${selectedReactionService}`;
  };

  return (
    <Modal visible={visible} onClose={onClose} title={getTitle()}>
      <View style={styles.modalContent}>
        {renderContent()}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listContainer: {
    width: '100%',
  },
  modalContent: {
    paddingVertical: spacing.sm,
    width: '100%',
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center', // Center the services
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  serviceCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    width: 105, // Fixed width for consistent sizing
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 115, // Taller for better proportions
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  serviceName: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
    fontSize: 14,
  },
  serviceCount: {
    textAlign: 'center',
    fontSize: 11,
  },
  choiceRow: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
    width: '100%',
    marginBottom: spacing.sm,
  },
  actionReactionRow: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    width: '100%',
  },
  actionReactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionReactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionReactionTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  actionReactionName: {
    fontWeight: '600',
  },
  backButton: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
    width: '100%',
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  spacer: {
    height: spacing.sm,
  },
});


