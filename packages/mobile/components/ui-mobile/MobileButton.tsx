import React from 'react';
import {
  Platform,
  View,
  ActivityIndicator,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  Button,
  type ButtonProps,
  spacing,
  borderRadius,
} from '@area/ui';
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

  // Map variant to Button variant (danger is not in base Button)
  const buttonVariant: 'primary' | 'secondary' | 'ghost' =
    variant === 'danger' ? 'primary' : variant;

  // Get theme-based styles for the button
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.lg,
    };

    if (variant === 'danger') {
      baseStyle.backgroundColor = currentTheme.colors.danger;
    } else if (variant === 'secondary') {
      baseStyle.backgroundColor = currentTheme.colors.surfaceMuted;
      baseStyle.borderWidth = 1;
      baseStyle.borderColor =
        (currentTheme.colors as any).borderSubtle ||
        currentTheme.colors.border;
    } else if (variant === 'ghost') {
      baseStyle.backgroundColor = 'transparent';
    }

    return baseStyle;
  };

  // Get text color based on variant and theme
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

  const mergedButtonStyle = StyleSheet.flatten([
    getButtonStyle(),
    style,
  ]) as ViewStyle;

  const mergedLabelStyle = StyleSheet.flatten([
    {
      color: getTextColor(),
    },
    labelStyle,
  ]);

  const button = (
    <View style={[{ position: 'relative' }, fullWidth && { width: '100%' }]}>
      <Button
        label={label}
        onPress={handlePress}
        variant={buttonVariant}
        disabled={disabled || loading}
        fullWidth={fullWidth}
        style={mergedButtonStyle}
        labelStyle={mergedLabelStyle}
        {...buttonProps}
      />
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            gap: spacing.xs,
          }}
        >
          <ActivityIndicator size="small" color={getTextColor()} />
        </View>
      )}
    </View>
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
