import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import type { ButtonProps } from './Button.types';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../../tokens';

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  style,
  labelStyle,
}) => {
  const getButtonStyle = () => {
    return [
      styles.button,
      variant === 'primary' && styles.buttonPrimary,
      variant === 'secondary' && styles.buttonSecondary,
      variant === 'ghost' && styles.buttonGhost,
      fullWidth && styles.buttonFullWidth,
      disabled && styles.buttonDisabled,
    ];
  };

  const getTextStyle = () => {
    return [
      styles.buttonText,
      (variant === 'primary' || variant === 'secondary') && styles.buttonTextFilled,
      variant === 'ghost' && styles.buttonTextGhost,
    ];
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        ...getButtonStyle(),
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}>
      <Text style={[...getTextStyle(), labelStyle]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  buttonTextFilled: {
    color: colors.white,
  },
  buttonTextGhost: {
    color: colors.primary,
  },
});
