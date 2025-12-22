import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { MobileText as Text } from '@/components/ui-mobile';
import { useAppTheme } from '@/contexts/ThemeContext';
import { ParamField } from '@/types/api';
import { ParamMap, isParamObject } from '@/utils/areaHelpers';
import { MobileInput } from '@/components/ui-mobile';
import { borderRadius, spacing } from '@area/ui';

interface ParameterFormProps {
  paramsDef: ParamMap | undefined;
  values: Record<string, any>;
  kind: 'action' | 'reaction';
  onParamChange: (key: string, fieldType: ParamField['type'], rawValue: any) => void;
}

export function ParameterForm({
  paramsDef,
  values,
  kind,
  onParamChange,
}: ParameterFormProps) {
  const { currentTheme } = useAppTheme();

  if (!paramsDef || typeof paramsDef === 'string' || !isParamObject(paramsDef) || Object.keys(paramsDef).length === 0) {
    return (
      <Text variant="body" color="muted">
        No parameters.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {Object.entries(paramsDef).map(([key, field]) => {
        const value = values[key];

        if (field.type === 'boolean') {
          return (
            <View key={key} style={styles.paramRow}>
              <View style={styles.paramLabelContainer}>
                <Text variant="body" style={styles.paramLabel}>
                  {key}
                </Text>
                {!!field.description && (
                  <Text variant="caption" color="muted">
                    {field.description}
                  </Text>
                )}
              </View>
              <Switch
                value={Boolean(value)}
                onValueChange={(v) => onParamChange(key, field.type, v)}
                trackColor={{
                  false: currentTheme.colors.surfaceMuted,
                  true: currentTheme.colors.primary,
                }}
                thumbColor={currentTheme.colors.white}
                ios_backgroundColor={currentTheme.colors.surfaceMuted}
              />
            </View>
          );
        }

        return (
          <View key={key} style={styles.paramBlock}>
            <Text variant="body" style={styles.paramLabel}>
              {key}
            </Text>
            {!!field.description && (
              <Text variant="caption" color="muted">
                {field.description}
              </Text>
            )}
            <MobileInput
              placeholder={field.example !== undefined ? String(field.example) : undefined}
              value={value === undefined ? '' : String(value)}
              onChangeText={(t) => onParamChange(key, field.type, t)}
              keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  paramLabelContainer: {
    flex: 1,
  },
  paramBlock: {
    gap: spacing.xs,
  },
  paramLabel: {
    fontWeight: '600',
  },
});
