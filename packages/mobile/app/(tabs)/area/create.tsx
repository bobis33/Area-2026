import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { MobileText as Text , MobileScreen , MobileButton , MobileInput } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { FadeInView } from '@/components/animations';
import { useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAreaCreation } from '@/hooks/useAreaCreation';
import { ActionReactionSelector } from '@/components/area/ActionReactionSelector';
import { SelectionModal } from '@/components/area/SelectionModal';

export default function CreateAreaScreen() {
  const { currentTheme } = useAppTheme();
  const { token } = useAuth();
  const {
    loading,
    submitting,
    selectedActionKey,
    selectedReactionKey,
    selectedAction,
    selectedReaction,
    actionParams,
    reactionParams,
    name,
    setName,
    isActive,
    setIsActive,
    modalOpen,
    modalStep,
    selectionKind,
    selectedActionService,
    selectedReactionService,
    actionsByService,
    reactionsByService,
    availableProviders,
    openModal,
    closeModal,
    goBackToService,
    handleServiceSelect,
    handleActionSelect,
    handleReactionSelect,
    setParamValue,
    handleSubmit,
  } = useAreaCreation();

  if (!token) {
    return (
      <MobileScreen safeArea>
        <View style={{ padding: 16 }}>
          <Text variant="title">Create automation</Text>
          <Text variant="body" color="muted" style={{ marginTop: 8 }}>
            You must be logged in.
          </Text>
        </View>
      </MobileScreen>
    );
  }

  return (
    <MobileScreen scroll safeArea keyboardAware={false}>
      <FadeInView delay={0} spring>
        <View style={styles.header}>
          <Text variant="title">Create automation</Text>
          <Text variant="body" color="muted">
            Choose an action, a reaction, and fill the parameters.
          </Text>
        </View>
      </FadeInView>

      <SectionCard>
        <Text variant="subtitle" style={styles.nameTitle}>
          Name
        </Text>
        <MobileInput
          placeholder="Auto-generated from selection"
          value={name}
          onChangeText={setName}
        />
      </SectionCard>

      <View style={styles.spacer} />

      <ActionReactionSelector
        title="Action"
        kind="action"
        loading={loading}
        selectedKey={selectedActionKey}
        selectedItem={selectedAction}
        params={actionParams}
        onSelect={() => openModal('action')}
        onParamChange={(key, fieldType, rawValue) => setParamValue('action', key, fieldType, rawValue)}
      />

      <View style={styles.spacer} />

      <ActionReactionSelector
        title="Reaction"
        kind="reaction"
        loading={loading}
        selectedKey={selectedReactionKey}
        selectedItem={selectedReaction}
        params={reactionParams}
        onSelect={() => openModal('reaction')}
        onParamChange={(key, fieldType, rawValue) => setParamValue('reaction', key, fieldType, rawValue)}
      />

      <View style={styles.spacer} />

      <SectionCard>
        <View style={styles.paramRow}>
          <View style={styles.paramLabelContainer}>
            <Text variant="subtitle" style={styles.activeTitle}>
              Active
            </Text>
            <Text variant="caption" color="muted">
              Enable this automation immediately after creation
            </Text>
          </View>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{
              false: currentTheme.colors.surfaceMuted,
              true: currentTheme.colors.primary,
            }}
            thumbColor={currentTheme.colors.white}
            ios_backgroundColor={currentTheme.colors.surfaceMuted}
          />
        </View>
      </SectionCard>

      <View style={styles.buttonSpacer} />

      <MobileButton
        variant="primary"
        onPress={handleSubmit}
        disabled={submitting}
        loading={submitting}
        fullWidth
        label={submitting ? 'Creating...' : 'Create automation'}
      />

      <View style={styles.footerSpacer} />

      <SelectionModal
        visible={modalOpen}
        onClose={closeModal}
        modalStep={modalStep}
        selectionKind={selectionKind}
        selectedActionService={selectedActionService}
        selectedReactionService={selectedReactionService}
        actionsByService={actionsByService}
        reactionsByService={reactionsByService}
        availableProviders={availableProviders}
        onServiceSelect={handleServiceSelect}
        onActionSelect={handleActionSelect}
        onReactionSelect={handleReactionSelect}
        onBack={goBackToService}
      />
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 16,
    gap: 8,
  },
  nameTitle: {
    marginBottom: 12,
  },
  spacer: {
    height: 12,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
  },
  paramLabelContainer: {
    flex: 1,
  },
  activeTitle: {
    marginBottom: 4,
  },
  buttonSpacer: {
    height: 16,
  },
  footerSpacer: {
    height: 24,
  },
});
