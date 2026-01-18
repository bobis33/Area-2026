import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { useTranslation } from '@/contexts/I18nContext';
import { Button, Text } from '@/components/ui';
import styles from './Auth.module.css';

export default function OAuthError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const t = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string>(
    'Authentication failed',
  );

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setErrorMessage(decodeURIComponent(message));
    }
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authBackground}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.bgCircle3}></div>
      </div>

      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo.svg" alt="AREA" />
        </div>

        <div className={styles.authHeader}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="title">{t('auth.oauth.failed')}</Text>
          </div>
          <Text variant="body" color="muted">
            {t('auth.oauth.failedDescription')}
          </Text>
        </div>

        <div className={styles.errorMessage} role="alert">
          <FiAlertCircle style={{ fontSize: '1.2em', flexShrink: 0 }} />
          <Text variant="body" color="danger">
            {errorMessage}
          </Text>
        </div>

        <div className={styles.oauthErrorContent}>
          <Text variant="body" color="muted" style={{ marginBottom: 16 }}>
            {t('auth.oauth.tryAgain')}
          </Text>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" fullWidth>
              {t('auth.oauth.goToLogin')}
            </Button>
          </Link>

          <Text variant="caption" color="muted">
            {t('auth.oauth.redirecting')}
          </Text>
        </div>
      </div>
    </div>
  );
}
