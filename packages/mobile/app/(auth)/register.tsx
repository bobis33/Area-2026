import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  MobileText as Text,
  MobileScreen,
  MobileButton,
  MobileInput,
} from '@/components/ui-mobile';

import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { apiService } from '@/services/api.service';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const t = useTranslation();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t('register.fillAllFields'));
      return;
    }

    if (password.length < 6) {
      setError(t('register.passwordTooShort'));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await apiService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await login(email.trim(), password);
      // Navigation is handled by AuthContext

      Alert.alert(t('common.success'), t('register.success'));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('register.error');
      setError(errorMessage);
      Alert.alert(t('register.registerError'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileScreen scroll={true} safeArea={true} keyboardAware>
      <Text
        variant="body"
        color="muted"
        align="center"
        style={{ marginBottom: 32 }}
      >
        {t('register.title')}
      </Text>

      <MobileInput
        label={t('register.fullName')}
        value={name}
        onChangeText={setName}
        placeholder={t('register.fullNamePlaceholder')}
        disabled={loading}
        errorMessage={error && !name.trim() ? error : undefined}
      />

      <MobileInput
        label={t('register.email')}
        value={email}
        onChangeText={setEmail}
        placeholder={t('register.emailPlaceholder')}
        keyboardType="email-address"
        disabled={loading}
        errorMessage={error && !email.trim() ? error : undefined}
      />

      <MobileInput
        label={t('register.password')}
        value={password}
        onChangeText={setPassword}
        placeholder={t('register.passwordPlaceholder')}
        secureTextEntry
        disabled={loading}
        helperText={t('register.passwordMinLength')}
        errorMessage={
          error && (!password.trim() || password.length < 6) ? error : undefined
        }
      />

      {error &&
        name.trim() &&
        email.trim() &&
        password.trim() &&
        password.length >= 6 && (
          <Text
            variant="caption"
            color="danger"
            style={{ marginTop: -8, marginBottom: 8 }}
          >
            {error}
          </Text>
        )}

      <MobileButton
        label={t('register.createAccount')}
        onPress={handleRegister}
        variant="primary"
        disabled={loading}
        fullWidth
      />

      <MobileButton
        label={t('register.alreadyHaveAccount')}
        onPress={() => router.back()}
        variant="ghost"
        disabled={loading}
        fullWidth
        style={{ marginTop: 8 }}
      />
    </MobileScreen>
  );
}
