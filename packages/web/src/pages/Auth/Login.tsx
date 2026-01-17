import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';
import type { LoginCredentials } from '@/types';
import {
  FaGoogle,
  FaDiscord,
  FaGithub,
  FaSpotify,
  FaGitlab,
} from 'react-icons/fa';
import { FiArrowLeft, FiMail, FiLock } from 'react-icons/fi';
import { Button, Input } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import styles from './Auth.module.css';

export default function Login() {
  const { login, loginWithOAuth, loading, error } = useAuth();
  const t = useTranslation();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      // Handled by useAuth hook
    }
  };

  const handleOAuthLogin = (
    provider: 'google' | 'discord' | 'github' | 'spotify' | 'gitlab',
  ) => {
    loginWithOAuth(provider);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBackground}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.bgCircle3}></div>
      </div>

      <div className={styles.authNav}>
        <Link to="/" className={styles.backToHome}>
          <FiArrowLeft />
          <span>{t('common.back')}</span>
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo.svg" alt="AREA" />
        </div>

        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>{t('auth.login.title')}</h1>
        </div>

        {error && (
          <div className={styles.errorMessage} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label={t('auth.login.email')}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={t('auth.login.emailPlaceholder')}
            required
            disabled={loading}
            leftIcon={<FiMail />}
          />

          <Input
            label={t('auth.login.password')}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder={t('auth.login.passwordPlaceholder')}
            required
            disabled={loading}
            leftIcon={<FiLock />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            fullWidth
          >
            {loading ? `${t('auth.login.signIn')}...` : t('auth.login.signIn')}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t('auth.login.orContinueWith').toUpperCase()}</span>
        </div>

        <div className={styles.oauthButtons}>
          <button
            type="button"
            className={`${styles.oauthButton} ${styles.oauthGoogle}`}
            onClick={() => handleOAuthLogin('google')}
            disabled={loading}
          >
            <FaGoogle className={styles.oauthIcon} />
            <span>{t('auth.oauth.google')}</span>
          </button>

          <button
            type="button"
            className={`${styles.oauthButton} ${styles.oauthDiscord}`}
            onClick={() => handleOAuthLogin('discord')}
            disabled={loading}
          >
            <FaDiscord className={styles.oauthIcon} />
            <span>{t('auth.oauth.discord')}</span>
          </button>

          <button
            type="button"
            className={`${styles.oauthButton} ${styles.oauthGithub}`}
            onClick={() => handleOAuthLogin('github')}
            disabled={loading}
          >
            <FaGithub className={styles.oauthIcon} />
            <span>{t('auth.oauth.github')}</span>
          </button>

          <button
            type="button"
            className={`${styles.oauthButton} ${styles.oauthSpotify}`}
            onClick={() => handleOAuthLogin('spotify')}
            disabled={loading}
          >
            <FaSpotify className={styles.oauthIcon} />
            <span>{t('auth.oauth.spotify')}</span>
          </button>

          <button
            type="button"
            className={`${styles.oauthButton} ${styles.oauthGitlab}`}
            onClick={() => handleOAuthLogin('gitlab')}
            disabled={loading}
          >
            <FaGitlab className={styles.oauthIcon} />
            <span>{t('auth.oauth.gitlab')}</span>
          </button>
        </div>

        <div className={styles.authFooter}>
          <p>
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className={styles.authLink}>
              {t('auth.login.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
