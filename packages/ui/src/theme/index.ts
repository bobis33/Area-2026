/**
 * AREA Theme System
 * Complete theme with light and dark modes
 */

import { lightColors, darkColors } from './colors';
import { spacing, borderRadius, fontSizes, fontWeights, lineHeights, shadows } from '../tokens';

export const theme = {
  light: {
    colors: lightColors,
    radius: {
      sm: 8,
      md: 16,
      lg: 24,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    },
    // Typography
    fontSizes,
    fontWeights,
    lineHeights,
    // Shadows
    shadows,
    // Border radius (using existing tokens)
    borderRadius,
  },
  dark: {
    colors: darkColors,
    radius: {
      sm: 8,
      md: 16,
      lg: 24,
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    },
    // Typography
    fontSizes,
    fontWeights,
    lineHeights,
    // Shadows
    shadows,
    // Border radius
    borderRadius,
  },
} as const;

export type Theme = typeof theme.light;
export type ThemeMode = 'light' | 'dark';

// Export colors for backward compatibility
export { lightColors, darkColors } from './colors';

