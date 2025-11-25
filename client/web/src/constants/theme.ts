/**
 * Modern theme with gradients and animations
 * Shared theme between mobile and web clients
 */

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

// Spacing system
export const Spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Border radius
export const BorderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

// Shadows
export const Shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

// Typography
export const Typography = {
  fontFamily: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Transitions
export const Transitions = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

