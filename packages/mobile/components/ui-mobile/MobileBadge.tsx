import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing, borderRadius } from '@area/ui';
import { MobileText as Text } from './MobileText';
import { useAppTheme } from '@/contexts/ThemeContext';

export type BadgeVariant = 'active' | 'inactive' | 'connected' | 'paused';

interface MobileBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  showDot?: boolean;
  style?: ViewStyle;
}

export const MobileBadge: React.FC<MobileBadgeProps> = ({
  variant,
  children,
  showDot = false,
  style,
}) => {
  const { currentTheme, isDark } = useAppTheme();

  const getBadgeStyles = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.md,
    };

    switch (variant) {
      case 'active':
        return {
          ...base,
          backgroundColor: currentTheme.colors.primarySoft || `${currentTheme.colors.primary}20`,
        };
      case 'connected':
        return {
          ...base,
          backgroundColor: currentTheme.colors.successSoft || 'rgba(26,158,91,0.15)',
        };
      case 'inactive':
        return {
          ...base,
          backgroundColor: currentTheme.colors.surfaceMuted || currentTheme.colors.surface,
          borderWidth: 1,
          borderColor: currentTheme.colors.borderSubtle || currentTheme.colors.border,
        };
      case 'paused':
        return {
          ...base,
          backgroundColor: currentTheme.colors.dangerSoft || 'rgba(224,52,52,0.15)',
        };
      default:
        return base;
    }
  };

  const getDotColor = (): string => {
    switch (variant) {
      case 'active':
        return currentTheme.colors.primary;
      case 'connected':
        return currentTheme.colors.success || (isDark ? '#42CF88' : '#1A9E5B');
      case 'inactive':
        return currentTheme.colors.textMuted || currentTheme.colors.textSecondary;
      case 'paused':
        return currentTheme.colors.danger || '#E03434';
      default:
        return currentTheme.colors.primary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'active':
        return currentTheme.colors.primary;
      case 'connected':
        return currentTheme.colors.success || (isDark ? '#42CF88' : '#1A9E5B');
      case 'inactive':
        return currentTheme.colors.textMuted || currentTheme.colors.textSecondary;
      case 'paused':
        return currentTheme.colors.danger || '#E03434';
      default:
        return currentTheme.colors.primary;
    }
  };

  return (
    <View style={[getBadgeStyles(), style]}>
      {showDot && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: getDotColor(),
            },
          ]}
        />
      )}
      <Text
        variant="caption"
        style={{
          fontSize: 11,
          textTransform: 'capitalize' as const,
          color: getTextColor(),
        }}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});


