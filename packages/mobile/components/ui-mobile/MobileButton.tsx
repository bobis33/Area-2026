import React from 'react';
import {
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  type ButtonProps,
  spacing,
  borderRadius,
  fontSizes,
  fontWeights,
} from '@area/ui';
import { MobileText as Text } from './MobileText';
import { useAppTheme } from '@/contexts/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface MobileButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: ButtonVariant;
  haptics?: boolean;
  animateIn?: boolean;
  loading?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  haptics = true,
  animateIn = false,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  label,
  style,
  labelStyle,
  ...buttonProps
}) => {
  const { currentTheme } = useAppTheme();

  const handlePress = () => {
    if (haptics && Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onPress();
  };

  // Custom implementation for all variants to use theme colors
  const getButtonStyles = (): ViewStyle => {
    const base: ViewStyle = {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: borderRadius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
      flexDirection: 'row',
      gap: spacing.sm,
    };

    if (fullWidth) {
      base.width = '100%';
    }

    switch (variant) {
      case 'primary':
        base.backgroundColor = currentTheme.colors.primary;
        break;
      case 'secondary':
        base.backgroundColor = currentTheme.colors.surfaceMuted;
        base.borderWidth = 1;
        base.borderColor =
          (currentTheme.colors as any).borderSubtle ||
          currentTheme.colors.border;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'danger':
        base.backgroundColor = currentTheme.colors.danger;
        break;
    }

    return base;
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
        return currentTheme.colors.primaryOn || currentTheme.colors.white;
      case 'danger':
        return currentTheme.colors.dangerOn || currentTheme.colors.white;
      case 'secondary':
      case 'ghost':
        return currentTheme.colors.text;
      default:
        return currentTheme.colors.text;
    }
  };

  const opacity = disabled || loading ? 0.5 : 1;

  const button = (
    <TouchableOpacity
      style={[getButtonStyles(), { opacity }, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: spacing.xs }}
        />
      )}
      <Text
        variant="body"
        style={
          {
            fontSize: fontSizes.md,
            fontWeight: fontWeights.semibold,
            color: getTextColor(),
            ...labelStyle,
          } as TextStyle
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (animateIn) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        {button}
      </Animated.View>
    );
  }

  return button;
};
