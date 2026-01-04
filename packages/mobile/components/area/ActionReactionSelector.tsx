import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MobileText as Text } from '@/components/ui-mobile';
import { SectionCard } from '@/components/layout/SectionCard';
import { useAppTheme } from '@/contexts/ThemeContext';
import { AreaActionDefinition, AreaReactionDefinition, ParamField } from '@/types/api';
import { ParameterForm } from './ParameterForm';

interface ActionReactionSelectorProps {
  title: string;
  kind: 'action' | 'reaction';
  loading: boolean;
  selectedKey: string;
  selectedItem: AreaActionDefinition | AreaReactionDefinition | undefined;
  params: Record<string, any>;
  onSelect: () => void;
  onParamChange: (key: string, fieldType: ParamField['type'], rawValue: any) => void;
}

export function ActionReactionSelector({
  title,
  kind,
  loading,
  selectedKey,
  selectedItem,
  params,
  onSelect,
  onParamChange,
}: ActionReactionSelectorProps) {
  const { currentTheme } = useAppTheme();

  return (
    <SectionCard>
      <Text variant="subtitle" style={styles.title}>
        {title}
      </Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity
          style={[
            styles.selectButton,
            {
              backgroundColor: selectedKey
                ? currentTheme.colors.primarySoft
                : currentTheme.colors.surfaceMuted,
              borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
            },
          ]}
          onPress={onSelect}
          activeOpacity={0.8}
        >
          <Text variant="body">
            {selectedKey || `Choose ${kind}`}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />

      <Text variant="subtitle" style={styles.paramsTitle}>
        {title} parameters
      </Text>
      <ParameterForm
        paramsDef={selectedItem?.parameters as any}
        values={params}
        kind={kind}
        onParamChange={onParamChange}
      />
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  selectButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  spacer: {
    height: 16,
  },
  paramsTitle: {
    marginBottom: 8,
  },
});


