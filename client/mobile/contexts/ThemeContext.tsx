import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme as uiTheme } from '@area/ui';

export type ThemeMode = 'system' | 'light' | 'dark';

type Theme = typeof uiTheme.light;

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
  // resolved theme actually applied
  currentTheme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'area_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setModeState(saved);
        }
      } catch (error) {
        // Failed to load theme preference
      } finally {
        setIsInitialized(true);
      }
    })();
  }, []);

  const setMode = async (next: ThemeMode) => {
    setModeState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // Failed to save theme preference
    }
  };

  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const currentTheme: Theme = (isDark ? uiTheme.dark : uiTheme.light) as Theme;

  // Don't render until theme is loaded to avoid flash
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, currentTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
};
