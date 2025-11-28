import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import type { CardProps } from './Card.types';
import { colors, spacing, borderRadius, shadows } from '../../tokens';

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  padding = 'md',
  elevated = false,
  border = false,
  style,
}) => {
  const getCardStyle = () => {
    return [
      styles.card,
      padding === 'none' && styles.cardPaddingNone,
      padding === 'sm' && styles.cardPaddingSm,
      padding === 'md' && styles.cardPaddingMd,
      padding === 'lg' && styles.cardPaddingLg,
      elevated && styles.cardElevated,
      border && styles.cardBorder,
    ];
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          ...getCardStyle(),
          pressed && styles.cardPressed,
          style,
        ]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[...getCardStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  cardPaddingNone: {
    padding: 0,
  },
  cardPaddingSm: {
    padding: spacing.sm,
  },
  cardPaddingMd: {
    padding: spacing.md,
  },
  cardPaddingLg: {
    padding: spacing.lg,
  },
  cardElevated: {
    ...shadows.md,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  cardPressed: {
    opacity: 0.8,
  },
});
