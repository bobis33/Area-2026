import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import en from '../locales/en.json';
import fr from '../locales/fr.json';

export type SupportedLocale = 'fr' | 'en';

const LOCALE_STORAGE_KEY = 'area:locale';

const translations: Record<SupportedLocale, typeof en> = {
  fr,
  en,
};

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');

  useEffect(() => {
    initializeLocale();
  }, []);

  const initializeLocale = () => {
    try {
      const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);

      if (savedLocale && (savedLocale === 'fr' || savedLocale === 'en')) {
        setLocaleState(savedLocale as SupportedLocale);
      } else {
        const systemLocale = detectSystemLocale();
        setLocaleState(systemLocale);
      }
    } catch (error) {
      console.error('Error loading locale:', error);
      const systemLocale = detectSystemLocale();
      setLocaleState(systemLocale);
    }
  };

  const detectSystemLocale = (): SupportedLocale => {
    try {
      const browserLanguage = navigator.language.toLowerCase();

      if (browserLanguage.startsWith('fr')) {
        return 'fr';
      }
      // Default to English for any other language
      return 'en';
    } catch (error) {
      console.error('Error detecting system locale:', error);
    }
    // Default fallback
    return 'en';
  };

  const setLocale = (newLocale: SupportedLocale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      setLocaleState(newLocale);
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }

    // Replace parameters in the translation string
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  };

  const isRTL = false;

  const contextValue: I18nContextValue = {
    locale,
    setLocale,
    t,
    isRTL,
  };

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Convenience hook that returns just the translation function
export function useTranslation() {
  const { t } = useI18n();
  return t;
}
