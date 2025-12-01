import React from 'react';
import { Pressable, View, Text, StyleSheet, Platform } from 'react-native';
import type { OAuthButtonProps } from './OAuthButton.types';
import { spacing, borderRadius, fontSizes, fontWeights } from '../../tokens';

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  label,
  onPress,
  backgroundColor,
  textColor = '#ffffff',
  borderColor,
  icon,
  disabled = false,
  loading = false,
  style,
  labelStyle,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor,
          borderColor: borderColor || backgroundColor,
          opacity: disabled || loading ? 0.6 : pressed ? 0.9 : 1,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      accessibilityLabel={label}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text
          style={[
            styles.label,
            { color: textColor },
            labelStyle,
          ]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    minHeight: 50,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
});


