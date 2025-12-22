import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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

interface SelectionModalProps {
  visible: boolean;
  onClose: () => void;
  modalStep: ModalStep;
  selectionKind: SelectionKind;
  selectedActionService: string | null;
  selectedReactionService: string | null;
  actionsByService: Record<string, AreaActionDefinition[]>;
  reactionsByService: Record<string, AreaReactionDefinition[]>;
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
  onServiceSelect,
  onActionSelect,
  onReactionSelect,
  onBack,
}: SelectionModalProps) {
  const { currentTheme } = useAppTheme();

  const renderContent = () => {
    if (modalStep === 'service') {
      const servicesForMode =
        selectionKind === 'action'
          ? Object.keys(actionsByService)
          : Object.keys(reactionsByService);

      return (
        <View style={styles.container}>
          {servicesForMode.length === 0 ? (
            <Text variant="body" color="muted">
              No {selectionKind === 'action' ? 'actions' : 'reactions'} available.
            </Text>
          ) : (
            <View style={styles.listContainer}>
              {servicesForMode.map((service) => {
                const count =
                  selectionKind === 'action'
                    ? (actionsByService[service]?.length ?? 0)
                    : (reactionsByService[service]?.length ?? 0);

                return (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.choiceRow,
                      {
                        backgroundColor: currentTheme.colors.surfaceMuted,
                        borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                      },
                    ]}
                    onPress={() => onServiceSelect(service)}
                    activeOpacity={0.8}
                  >
                    <Text variant="body">
                      {service} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      );
    }

    if (modalStep === 'action' && selectedActionService) {
      const serviceActions = actionsByService[selectedActionService] || [];

      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: currentTheme.colors.surfaceMuted,
                borderColor: currentTheme.colors.tabBarBorder,
              },
            ]}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text variant="body" color="muted">← Back to services</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          {serviceActions.length === 0 ? (
            <Text variant="body" color="muted">
              No actions available for {selectedActionService}.
            </Text>
          ) : (
            <View style={styles.listContainer}>
              {serviceActions.map((action) => {
                const key = makeKey(action.service, action.type);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.choiceRow,
                      {
                        backgroundColor: currentTheme.colors.surfaceMuted,
                        borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                      },
                    ]}
                    onPress={() => onActionSelect(action)}
                    activeOpacity={0.8}
                  >
                    <Text variant="body">
                      {key}
                    </Text>
                  </TouchableOpacity>
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
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                backgroundColor: currentTheme.colors.surfaceMuted,
                borderColor: currentTheme.colors.tabBarBorder,
              },
            ]}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Text variant="body" color="muted">← Back to services</Text>
          </TouchableOpacity>
          <View style={styles.spacer} />
          {serviceReactions.length === 0 ? (
            <Text variant="body" color="muted">
              No reactions available for {selectedReactionService}.
            </Text>
          ) : (
            <View style={styles.listContainer}>
              {serviceReactions.map((reaction) => {
                const key = makeKey(reaction.service, reaction.type);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.choiceRow,
                      {
                        backgroundColor: currentTheme.colors.surfaceMuted,
                        borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
                      },
                    ]}
                    onPress={() => onReactionSelect(reaction)}
                    activeOpacity={0.8}
                  >
                    <Text variant="body">
                      {key}
                    </Text>
                  </TouchableOpacity>
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
  backButton: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    width: '100%',
  },
  spacer: {
    height: spacing.sm,
  },
});


