import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { Button, Text } from '@/components/ui';
import styles from './Auth.module.css';

export default function OAuthError() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
            <Text variant="title">Authentication Failed</Text>
          </div>
          <Text variant="body" color="muted">We couldn't sign you in</Text>
        </div>

        <div className={styles.errorMessage} role="alert">
          <FiAlertCircle style={{ fontSize: '1.2em', flexShrink: 0 }} />
          <Text variant="body" color="danger">{errorMessage}</Text>
        </div>

        <div className={styles.oauthErrorContent}>
          <Text variant="body" color="muted" style={{ marginBottom: 16 }}>
            Please try again or use a different sign-in method.
          </Text>

          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg" fullWidth>
              Go to Login
            </Button>
          </Link>

          <Text variant="caption" color="muted">
            Redirecting automatically in 5 seconds...
          </Text>
        </div>
      </div>
    </div>
  );
}
