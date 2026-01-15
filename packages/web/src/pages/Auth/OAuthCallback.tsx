import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { consumeOAuthRedirectPath } from '@/utils/storage';
import styles from './Auth.module.css';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAuth } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );

  useEffect(() => {
    const userParam = searchParams.get('user');
    const tokenParam = searchParams.get('token');
    const redirectPath = consumeOAuthRedirectPath();

    if (!userParam) {
      navigate('/auth/error?message=No user data received');
      return;
    }

    if (!tokenParam) {
      navigate('/auth/error?message=No token received');
      return;
    }

    try {
      const token = decodeURIComponent(tokenParam);
      localStorage.setItem('token', token);
      handleOAuthCallback(userParam);
      refreshAuth();
      setStatus('success');
      setTimeout(() => {
        navigate(redirectPath || '/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Failed to process OAuth callback:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid authentication data';
      navigate(`/auth/error?message=${encodeURIComponent(errorMessage)}`);
    }
  }, [searchParams, navigate, refreshAuth]);

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
          <h1 className={styles.authTitle}>
            {status === 'processing' && 'Processing Authentication...'}
            {status === 'success' && 'Authentication Successful'}
            {status === 'error' && 'Authentication Failed'}
          </h1>
          <p className={styles.authSubtitle}>
            {status === 'processing' && 'Please wait while we sign you in'}
            {status === 'success' && 'Redirecting you to the application...'}
            {status === 'error' && 'An error occurred'}
          </p>
        </div>

        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
      </div>
    </div>
  );
}
