import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuthCallback } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import './Auth.css';

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
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Failed to process OAuth callback:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid authentication data';
      navigate(`/auth/error?message=${encodeURIComponent(errorMessage)}`);
    }
  }, [searchParams, navigate, refreshAuth]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            {status === 'processing' && 'Processing Authentication...'}
            {status === 'success' && 'Authentication Successful'}
            {status === 'error' && 'Authentication Failed'}
          </h1>
          <p>
            {status === 'processing' && 'Please wait while we sign you in'}
            {status === 'success' && 'Redirecting you to the application...'}
            {status === 'error' && 'An error occurred'}
          </p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
}
