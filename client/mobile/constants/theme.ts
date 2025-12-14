/**
 * Modern theme with gradients and animations
 */

import { Platform } from 'react-native';

// Primary colors - Modern vibrant indigo/purple theme
const primaryLight = '#6366f1'; // Vibrant Indigo
const primaryDark = '#818cf8'; // Light Indigo
const secondaryLight = '#8b5cf6'; // Vibrant Purple
const secondaryDark = '#a78bfa'; // Light Purple

const tintColorLight = primaryLight;
const tintColorDark = primaryDark;

export const Colors = {
  light: {
    text: '#1e293b',
    textSecondary: '#64748b',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    primary: primaryLight,
    primaryDark: '#4f46e5',
    secondary: secondaryLight,
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    border: '#e2e8f0',
    card: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    input: '#f1f5f9',
    inputFocus: '#e0e7ff',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    primary: primaryDark,
    primaryDark: '#6366f1',
    secondary: secondaryDark,
    success: '#34d399',
    error: '#f87171',
    warning: '#fbbf24',
    border: '#334155',
    card: '#1e293b',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    input: '#1e293b',
    inputFocus: '#334155',
  },
};

// Gradient colors
export const Gradients = {
  light: {
    primary: [primaryLight, secondaryLight],
    background: ['#ffffff', '#f8fafc'],
    card: ['#ffffff', '#ffffff'],
  },
  dark: {
    primary: [primaryDark, secondaryDark],
    background: ['#0f172a', '#1e293b'],
    card: ['#1e293b', '#334155'],
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
