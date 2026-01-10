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
  surfaceMuted: '#F0F0F1', 
  surface0: '#FFFFFF',

  // Text
  text: '#000000', 
  textSecondary: '#3A3837', 
  textMuted: '#5A5857', 

  // Border
  border: '#D1D1D2',
  borderSubtle: 'rgba(0,0,0,0.15)',

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
  success: '#0D7A4A',
  successSoft: '#D1F2E3',
  warning: '#D97706',
  warningSoft: '#FEF3C7',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarBorder: 'rgba(0,0,0,0.12)',
  tabIconActive: '#3A56D2',
  tabIconInactive: '#5A5857',

  // Legacy support (for backward compatibility)
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F5F5F6',
  gray100: '#F4F4F5',
  gray200: '#D1D1D2',
  gray300: '#B8B7B6',
  gray400: '#5A5857',
  gray500: '#4A4847',
  gray600: '#3A3837',
  gray700: '#2A2827',
  gray800: '#1A1918',
  gray900: '#000000',
} as const;

export const darkColors = {
  // Backgrounds - Pure black
  background: '#000000',
  backgroundAlt: '#000000',

  // Surfaces - Distinct layers for depth
  surface: '#0F0F0F',
  surfaceMuted: '#1A1A1A',
  
  surface0: '#000000',     // App background (pure black)

  // Text 
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.95)',
  textMuted: 'rgba(255,255,255,0.75)',

  // Border
  border: 'rgba(255,255,255,0.15)',
  borderSubtle: 'rgba(255,255,255,0.12)',

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
  success: '#4ADE80',
  successSoft: 'rgba(74,222,128,0.2)',
  warning: '#FBBF24', 
  warningSoft: 'rgba(251,191,36,0.2)', 

  // Tab bar
  tabBarBackground: '#000000',
  tabBarBorder: 'rgba(255,255,255,0.15)',
  tabIconActive: '#FFFFFF',
  tabIconInactive: 'rgba(255,255,255,0.75)',

  // Legacy support (for backward compatibility)
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#0A0A0A',
  gray100: '#111111',
  gray200: 'rgba(255,255,255,0.15)',
  gray300: 'rgba(255,255,255,0.25)',
  gray400: 'rgba(255,255,255,0.55)',
  gray500: 'rgba(255,255,255,0.75)',
  gray600: 'rgba(255,255,255,0.95)',
  gray700: '#FFFFFF',
  gray800: '#FFFFFF',
  gray900: '#FFFFFF',
} as const;