/**
 * Brand style helpers
 * Unified styles for consistent UI across the app
 */

import { ViewStyle, TextStyle } from 'react-native';
import type { Theme } from '@area/ui';

/**
 * Get brand styles based on current theme
 */
export const getBrandStyles = (theme: Theme) => {
  const { colors } = theme;

  return {
    // Surfaces
    surfaceCard: {
      backgroundColor: colors.surface || colors.surface0,
      borderColor: colors.borderSubtle || colors.border,
      borderWidth: 1,
    } as ViewStyle,

    surfaceMuted: {
      backgroundColor: colors.surfaceMuted || colors.surface,
    } as ViewStyle,

    surfaceInput: {
      backgroundColor: colors.surfaceMuted || colors.surface,
      borderColor: colors.borderSubtle || colors.border,
      borderWidth: 1,
    } as ViewStyle,

    // Borders
    border: {
      borderColor: colors.borderSubtle || colors.border,
      borderWidth: 1,
    } as ViewStyle,

    // Text
    text: {
      color: colors.text,
    } as TextStyle,

    textMuted: {
      color: colors.textMuted,
    } as TextStyle,

    textSecondary: {
      color: colors.textSecondary,
    } as TextStyle,

    // Brand colors
    primary: {
      backgroundColor: colors.brandPrimary || colors.primary,
      color: colors.brandOnPrimary || colors.primaryOn,
    },

    danger: {
      backgroundColor: colors.brandDanger || colors.danger,
      color: colors.brandOnDanger || colors.dangerOn,
    },
  };
};
