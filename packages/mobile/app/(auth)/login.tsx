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
import { spacing } from '@area/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Navigation is handled by AuthContext
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Connection error';
      setError(errorMessage);
      Alert.alert('Connection Error', errorMessage);
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
            Sign in
          </Text>
          <Text
            variant="body"
            color="muted"
            align="center"
            style={styles.subtitle}
          >
            Access your account to manage your automations
          </Text>
        </View>

        <View style={styles.formSection}>
          <MobileInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            keyboardType="email-address"
            disabled={loading}
            errorMessage={error && !email.trim() ? error : undefined}
          />
          <MobileInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
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
            label="Sign in"
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
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text variant="caption" color="default" style={styles.linkText}>
                Sign up
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
