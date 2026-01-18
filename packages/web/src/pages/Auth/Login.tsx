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
import { Button, Input, OAuthButton, Text } from '@/components/ui';
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
          <span>{t('auth.backToHome')}</span>
        </Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <LanguageSelector />
          <ThemeToggle />
        </div>
      </div>

      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo.svg" alt="AREA" />
        </div>

        <div className={styles.authHeader}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="title">{t('auth.login.title')}</Text>
          </div>
          <Text variant="body" color="muted">
            {t('auth.login.subtitle')}
          </Text>
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
            variant="primary"
            size="lg"
            disabled={loading}
            fullWidth
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as any);
            }}
          >
            {loading ? t('auth.login.signingIn') : t('auth.login.signIn')}
          </Button>
        </form>

        <div className={styles.divider}>
          <span>{t('auth.orContinueWith')}</span>
        </div>

        <div className={styles.oauthButtons}>
          <OAuthButton
            label="Google"
            onClick={() => handleOAuthLogin('google')}
            backgroundColor="#ffffff"
            textColor="#1f2937"
            borderColor="#e5e7eb"
            icon={<FaGoogle />}
            disabled={loading}
            loading={loading}
          />

          <OAuthButton
            label="Discord"
            onClick={() => handleOAuthLogin('discord')}
            backgroundColor="#5865F2"
            textColor="#ffffff"
            icon={<FaDiscord />}
            disabled={loading}
            loading={loading}
          />

          <OAuthButton
            label="GitHub"
            onClick={() => handleOAuthLogin('github')}
            backgroundColor="#18181B"
            textColor="#ffffff"
            icon={<FaGithub />}
            disabled={loading}
            loading={loading}
          />

          <OAuthButton
            label="Spotify"
            onClick={() => handleOAuthLogin('spotify')}
            backgroundColor="#1DB954"
            textColor="#ffffff"
            icon={<FaSpotify />}
            disabled={loading}
            loading={loading}
          />

          <OAuthButton
            label="GitLab"
            onClick={() => handleOAuthLogin('gitlab')}
            backgroundColor="#FC6D26"
            textColor="#ffffff"
            icon={<FaGitlab />}
            disabled={loading}
            loading={loading}
          />
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
