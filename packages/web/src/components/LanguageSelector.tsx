import { useI18n } from '@/contexts/I18nContext';
import styles from './LanguageSelector.module.css';

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  const handleLanguageChange = (newLocale: 'en' | 'fr') => {
    setLocale(newLocale);
  };

  return (
    <div className={styles.languageSelector}>
      <button
        className={`${styles.languageButton} ${locale === 'en' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        className={`${styles.languageButton} ${locale === 'fr' ? styles.active : ''}`}
        onClick={() => handleLanguageChange('fr')}
        aria-label="Passer en français"
      >
        FR
      </button>
    </div>
  );
}
