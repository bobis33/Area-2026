import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterData } from '@/types';
import { FiArrowLeft, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { Button, Input, Text } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import styles from './Auth.module.css';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export default function Register() {
  const { register, loading, error } = useAuth();
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
      setValidationError('Email, name and password are required');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
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
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      <div className={styles.authCard}>
        <div className={styles.authLogo}>
          <img src="/logo.svg" alt="AREA" />
        </div>

        <div className={styles.authHeader}>
          <div style={{ marginBottom: 8 }}>
            <Text variant="title">Create Account</Text>
          </div>
          <Text variant="body" color="muted">
            Join AREA and start automating your digital life
          </Text>
        </div>

        {(error || validationError) && (
          <div className={styles.errorMessage} role="alert">
            {error || validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.authForm}>
          <Input
            label="Name"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your full name"
            required
            disabled={loading}
            leftIcon={<FiUser />}
          />

          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="your.email@example.com"
            required
            disabled={loading}
            leftIcon={<FiMail />}
          />

          <Input
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="At least 6 characters"
            required
            disabled={loading}
            leftIcon={<FiLock />}
          />

          <Input
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            placeholder="Confirm your password"
            required
            disabled={loading}
            leftIcon={<FiLock />}
          />

          <Button
            variant="primary"
            size="lg"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <p>
            Already have an account?{' '}
            <Link to="/login" className={styles.authLink}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
