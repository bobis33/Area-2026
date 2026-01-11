/**
 * Web UI Components
 *
 * These components wrap the shared @area/ui components and add
 * web-specific functionality while maintaining visual consistency
 * with the mobile app.
 */

export { WebButton } from './WebButton';
export type { WebButtonProps } from './WebButton';

export { WebInput } from './WebInput';
export type { WebInputProps } from './WebInput';

export { WebCard } from './WebCard';
export type { WebCardProps } from './WebCard';

// export { WebText } from "./WebText";
// export type { WebTextProps } from "./WebText";

export const colors = {
  primary: '#1e40af',
  primaryDark: '#1e3a8a',
  primaryLight: '#3b82f6',
  white: '#ffffff',
  black: '#000000',
  gray50: '#f8fafc',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  gray400: '#94a3b8',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
