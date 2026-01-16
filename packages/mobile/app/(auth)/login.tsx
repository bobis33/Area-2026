import { useState } from 'react';
import { Alert, View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  MobileText as Text,
  MobileScreen,
  MobileButton,
  MobileInput,
} from '@/components/ui-mobile';
import { SocialLoginButtons } from '@/components/auth/SocialLoginButtons';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/I18nContext';
import { spacing } from '@area/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const t = useTranslation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError(t('login.fillAllFields'));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation is handled by AuthContext
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('login.connectionError');
      setError(errorMessage);
      Alert.alert(t('login.connectionError'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasAllFields = email.trim() && password.trim();

  return (
    <MobileScreen scroll safeArea keyboardAware>
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text variant="title" style={styles.title}>
            {t('login.title')}
          </Text>
          <Text
            variant="body"
            color="muted"
            align="center"
            style={styles.subtitle}
          >
            {t('login.subtitle')}
          </Text>
        </View>

        <View style={styles.formSection}>
          <MobileInput
            label={t('login.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('login.emailPlaceholder')}
            keyboardType="email-address"
            disabled={loading}
            errorMessage={error && !email.trim() ? error : undefined}
          />
          <MobileInput
            label={t('login.password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('login.passwordPlaceholder')}
            secureTextEntry
            disabled={loading}
            errorMessage={error && !password.trim() ? error : undefined}
          />
          {error && hasAllFields && (
            <Text variant="caption" color="danger" style={styles.errorText}>
              {error}
            </Text>
          )}
        </View>

        <View style={styles.actionsSection}>
          <MobileButton
            label={t('login.signIn')}
            onPress={handleLogin}
            variant="primary"
            disabled={loading || !hasAllFields}
            fullWidth
          />
        </View>

        <SocialLoginButtons disabled={loading} />

        <View style={styles.footerSection}>
          <View style={styles.footerContent}>
            <Text variant="caption" color="muted" align="center">
              {t('login.noAccount')}{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text variant="caption" color="default" style={styles.linkText}>
                {t('login.signUp')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </MobileScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  headerSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    paddingHorizontal: spacing.lg,
  },
  formSection: {
    marginBottom: spacing.lg,
  },
  errorText: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  actionsSection: {
    marginBottom: spacing.md,
  },
  footerSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkText: {
    fontWeight: '600',
  },
});
