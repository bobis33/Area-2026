import React from 'react';
import { Platform, TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Button, type ButtonProps, Text, colors, spacing, borderRadius, fontSizes, fontWeights } from '@area/ui';
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

  // Use custom implementation for danger variant, otherwise use Button from @area/ui
  if (variant === 'danger') {
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
        backgroundColor: currentTheme.colors.danger, // Using theme color for danger
      };

      if (fullWidth) {
        base.width = '100%';
      }

      return base;
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
          color={colors.white}
          style={{ marginRight: spacing.xs }}
        />
        )}
        <Text
          variant="body"
          style={{
            fontSize: fontSizes.md,
            fontWeight: fontWeights.semibold,
            color: colors.white,
            ...labelStyle,
          } as TextStyle}
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
  }

  // For other variants, use the existing Button from @area/ui
  const button = (
    <Button
      {...buttonProps}
      variant={variant}
      onPress={handlePress}
      disabled={disabled}
      fullWidth={fullWidth}
      label={label}
      style={style}
      labelStyle={labelStyle}
    />
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
