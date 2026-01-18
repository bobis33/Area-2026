import React, { createContext, useContext, useEffect, useState } from 'react';
import { lightColors, darkColors, spacing, borderRadius, fontSizes, fontWeights } from '@area/ui';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Inject theme colors and tokens as CSS variables
 */
function injectCSSVariables(mode: ThemeMode) {
  const colors = mode === 'light' ? lightColors : darkColors;
  const root = document.documentElement;

  // Colors - Backgrounds
  root.style.setProperty('--color-background', colors.background);
  root.style.setProperty('--color-background-alt', colors.backgroundAlt);

  // Colors - Surfaces
  root.style.setProperty('--color-surface', colors.surface);
  root.style.setProperty('--color-surface-muted', colors.surfaceMuted);
  root.style.setProperty('--color-surface-0', colors.surface0);

  // Colors - Text
  root.style.setProperty('--color-text', colors.text);
  root.style.setProperty('--color-text-secondary', colors.textSecondary);
  root.style.setProperty('--color-text-muted', colors.textMuted);

  // Colors - Border
  root.style.setProperty('--color-border', colors.border);
  root.style.setProperty('--color-border-subtle', colors.borderSubtle);

  // Colors - Primary/Brand
  root.style.setProperty('--color-primary', colors.primary);
  root.style.setProperty('--color-primary-soft', colors.primarySoft);
  root.style.setProperty('--color-primary-on', colors.primaryOn);
  root.style.setProperty('--color-brand-primary', colors.brandPrimary);
  root.style.setProperty('--color-brand-on-primary', colors.brandOnPrimary);

  // Colors - Danger
  root.style.setProperty('--color-danger', colors.danger);
  root.style.setProperty('--color-danger-soft', colors.dangerSoft);
  root.style.setProperty('--color-danger-on', colors.dangerOn);
  root.style.setProperty('--color-brand-danger', colors.brandDanger);
  root.style.setProperty('--color-brand-on-danger', colors.brandOnDanger);

  // Colors - Status
  root.style.setProperty('--color-success', colors.success);
  root.style.setProperty('--color-success-soft', colors.successSoft);
  root.style.setProperty('--color-warning', colors.warning);
  root.style.setProperty('--color-warning-soft', colors.warningSoft);

  // Colors - Tab bar
  root.style.setProperty('--color-tab-bar-background', colors.tabBarBackground);
  root.style.setProperty('--color-tab-bar-border', colors.tabBarBorder);
  root.style.setProperty('--color-tab-icon-active', colors.tabIconActive);
  root.style.setProperty('--color-tab-icon-inactive', colors.tabIconInactive);

  // Colors - Legacy gray scale
  root.style.setProperty('--color-white', colors.white);
  root.style.setProperty('--color-black', colors.black);
  root.style.setProperty('--color-gray-50', colors.gray50);
  root.style.setProperty('--color-gray-100', colors.gray100);
  root.style.setProperty('--color-gray-200', colors.gray200);
  root.style.setProperty('--color-gray-300', colors.gray300);
  root.style.setProperty('--color-gray-400', colors.gray400);
  root.style.setProperty('--color-gray-500', colors.gray500);
  root.style.setProperty('--color-gray-600', colors.gray600);
  root.style.setProperty('--color-gray-700', colors.gray700);
  root.style.setProperty('--color-gray-800', colors.gray800);
  root.style.setProperty('--color-gray-900', colors.gray900);

  // Spacing
  root.style.setProperty('--spacing-xs', `${spacing.xs}px`);
  root.style.setProperty('--spacing-sm', `${spacing.sm}px`);
  root.style.setProperty('--spacing-md', `${spacing.md}px`);
  root.style.setProperty('--spacing-lg', `${spacing.lg}px`);
  root.style.setProperty('--spacing-xl', `${spacing.xl}px`);
  root.style.setProperty('--spacing-xxl', `${spacing.xxl}px`);

  // Border Radius
  root.style.setProperty('--radius-none', `${borderRadius.none}px`);
  root.style.setProperty('--radius-sm', `${borderRadius.sm}px`);
  root.style.setProperty('--radius-md', `${borderRadius.md}px`);
  root.style.setProperty('--radius-lg', `${borderRadius.lg}px`);
  root.style.setProperty('--radius-xl', `${borderRadius.xl}px`);
  root.style.setProperty('--radius-full', `${borderRadius.full}px`);

  // Font Sizes
  root.style.setProperty('--font-size-xs', `${fontSizes.xs}px`);
  root.style.setProperty('--font-size-sm', `${fontSizes.sm}px`);
  root.style.setProperty('--font-size-md', `${fontSizes.md}px`);
  root.style.setProperty('--font-size-lg', `${fontSizes.lg}px`);
  root.style.setProperty('--font-size-xl', `${fontSizes.xl}px`);
  root.style.setProperty('--font-size-2xl', `${fontSizes['2xl']}px`);
  root.style.setProperty('--font-size-3xl', `${fontSizes['3xl']}px`);
  root.style.setProperty('--font-size-4xl', `${fontSizes['4xl']}px`);

  // Font Weights
  root.style.setProperty('--font-weight-normal', fontWeights.normal);
  root.style.setProperty('--font-weight-medium', fontWeights.medium);
  root.style.setProperty('--font-weight-semibold', fontWeights.semibold);
  root.style.setProperty('--font-weight-bold', fontWeights.bold);

  // Shadows (as box-shadow strings for web)
  root.style.setProperty(
    '--shadow-sm',
    `0 1px 2px rgba(0, 0, 0, ${mode === 'light' ? 0.05 : 0.3})`,
  );
  root.style.setProperty(
    '--shadow-md',
    `0 2px 4px rgba(0, 0, 0, ${mode === 'light' ? 0.1 : 0.4})`,
  );
  root.style.setProperty(
    '--shadow-lg',
    `0 4px 8px rgba(0, 0, 0, ${mode === 'light' ? 0.15 : 0.5})`,
  );

  // Set data attribute for theme mode (useful for CSS selectors)
  root.setAttribute('data-theme', mode);
}

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme(): ThemeMode {
  // Check localStorage first
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialTheme);

  // Inject CSS variables on mount and when mode changes
  useEffect(() => {
    injectCSSVariables(mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 */
export function useWebTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useWebTheme must be used within a ThemeProvider');
  }
  return context;
}
