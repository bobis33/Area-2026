import { FiSun, FiMoon } from 'react-icons/fi';
import { useWebTheme } from '../context/ThemeContext';
import styles from './ThemeToggle.module.css';

/**
 * ThemeToggle component - Allows users to switch between light and dark themes
 */
export function ThemeToggle() {
  const { mode, toggleTheme } = useWebTheme();

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <FiMoon className={styles.icon} />
      ) : (
        <FiSun className={styles.icon} />
      )}
    </button>
  );
}
