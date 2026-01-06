/**
 * AREA brand color palette
 * Light and dark theme colors based on AREA brand identity
 */

export const lightColors = {
  // Backgrounds
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F6',

  // Surfaces
  surface: '#FFFFFF',
  surfaceMuted: '#F4F4F5',
  surface0: '#FFFFFF',

  // Text
  text: '#222120',
  textSecondary: '#5A5857',
  textMuted: '#A3A1A0',

  // Border
  border: '#E2E2E3',
  borderSubtle: 'rgba(0,0,0,0.08)',

  // Primary / brand
  primary: '#3A56D2',
  primarySoft: '#E3E8FF',
  primaryOn: '#FFFFFF',
  brandPrimary: '#3A56D2',
  brandOnPrimary: '#FFFFFF',

  // Danger / accent
  danger: '#E03434',
  dangerSoft: '#FCE5E5',
  dangerOn: '#FFFFFF',
  brandDanger: '#E03434',
  brandOnDanger: '#FFFFFF',

  // Status
  success: '#1A9E5B',
  successSoft: '#DFF6EA',
  warning: '#F2A93B',
  warningSoft: '#FFF3DB',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: 'rgba(0,0,0,0.05)',
  tabIconActive: '#3A56D2',
  tabIconInactive: '#A3A1A0',

  // Legacy support (for backward compatibility)
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F5F5F6',
  gray100: '#F4F4F5',
  gray200: '#E2E2E3',
  gray300: '#D1D1D2',
  gray400: '#A3A1A0',
  gray500: '#5A5857',
  gray600: '#4A4847',
  gray700: '#3A3837',
  gray800: '#2A2827',
  gray900: '#222120',
} as const;

export const darkColors = {
  // Backgrounds - Pure black
  background: '#000000',
  backgroundAlt: '#000000',

  // Surfaces - Distinct layers for depth
  surface: '#0A0A0A',      // Cards, modals (surface1) - slightly lighter for depth
  surfaceMuted: '#111111', // Inputs, rows (surface2) - slightly lighter
  surface0: '#000000',     // App background (pure black)

  // Text - High contrast for readability
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.85)',
  textMuted: 'rgba(255,255,255,0.65)', // WCAG compliant muted text

  // Border - Subtle but visible
  border: 'rgba(255,255,255,0.08)',
  borderSubtle: 'rgba(255,255,255,0.08)',

  // Primary / brand - Brand blue
  primary: '#3A56D2',
  primarySoft: 'rgba(58,86,210,0.15)',
  primaryOn: '#FFFFFF',
  brandPrimary: '#3A56D2',
  brandOnPrimary: '#FFFFFF',

  // Danger / accent - Brand red
  danger: '#E03434',
  dangerSoft: 'rgba(224,52,52,0.15)',
  dangerOn: '#FFFFFF',
  brandDanger: '#E03434',
  brandOnDanger: '#FFFFFF',

  // Status
  success: '#42CF88',
  successSoft: 'rgba(66,207,136,0.15)',
  warning: '#F2A93B',
  warningSoft: 'rgba(242,169,59,0.15)',

  // Tab bar
  tabBarBackground: '#000000',
  tabBarBorder: 'rgba(255,255,255,0.08)',
  tabIconActive: '#FFFFFF',
  tabIconInactive: 'rgba(255,255,255,0.65)',

  // Legacy support (for backward compatibility)
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#0A0A0A',
  gray100: '#111111',
  gray200: 'rgba(255,255,255,0.08)',
  gray300: 'rgba(255,255,255,0.12)',
  gray400: 'rgba(255,255,255,0.45)',
  gray500: 'rgba(255,255,255,0.65)',
  gray600: 'rgba(255,255,255,0.85)',
  gray700: '#FFFFFF',
  gray800: '#FFFFFF',
  gray900: '#FFFFFF',
} as const;