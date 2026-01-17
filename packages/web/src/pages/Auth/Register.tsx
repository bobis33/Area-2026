import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/contexts/I18nContext';
import type { RegisterData } from '@/types';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Button, Input } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import styles from './Auth.module.css';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export default function Register() {
  const { register, loading, error } = useAuth();
  const t = useTranslation();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError('');

    if (!formData.email || !formData.password || !formData.name) {
      setValidationError(t('auth.register.fillAllFields'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError(t('auth.register.passwordsDontMatch'));
      return;
    }
    if (formData.password.length < 6) {
      setValidationError(t('auth.register.passwordTooShort'));
      return;
    }

    try {
      const requestData: RegisterData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      };
      await register(requestData);
    } catch (err) {
      // Handled by useAuth hook
    }
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
          <h1 className={styles.authTitle}>{t('auth.register.title')}</h1>
        </div>

        {(error || validationError) && (
          <div className={styles.errorMessage} role="alert">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label={t('auth.register.fullName')}
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('auth.register.fullNamePlaceholder')}
            required
            disabled={loading}
            leftIcon={<FiUser />}
          />

          <Input
            label={t('auth.register.email')}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder={t('auth.register.emailPlaceholder')}
            required
            disabled={loading}
            leftIcon={<FiMail />}
          />

          <Input
            label={t('auth.register.password')}
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder={t('auth.register.passwordMinLength')}
            required
            disabled={loading}
            leftIcon={<FiLock />}
          />

          <Input
            label={t('auth.register.confirmPassword')}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder={t('auth.register.confirmPassword')}
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
            {loading
              ? `${t('auth.register.createAccount')}...`
              : t('auth.register.createAccount')}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            {t('auth.register.alreadyHaveAccount')}{' '}
            <Link to="/login" className={styles.authLink}>
              {t('auth.register.signIn')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
