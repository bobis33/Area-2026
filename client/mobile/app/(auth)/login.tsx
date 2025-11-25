import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <Animated.View entering={FadeIn.delay(100).duration(600)}>
            <ThemedText type="title" style={styles.title}>
              Bienvenue 👋
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Connectez-vous à votre compte AREA
            </ThemedText>
          </Animated.View>

          <ThemedView style={styles.form}>
            <Animated.View entering={FadeInDown.delay(200).springify().damping(15)}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Email
              </ThemedText>
              <AnimatedInput
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                editable={!loading}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).springify().damping(15)}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Mot de passe
              </ThemedText>
              <AnimatedInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                keyboardType="default"
                editable={!loading}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).springify().damping(15)}>
              <AnimatedButton
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                variant="primary">
                Se connecter
              </AnimatedButton>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).springify().damping(15)}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/register')}
                disabled={loading}>
                <ThemedText style={styles.linkText}>
                  Pas encore de compte ?{' '}
                  <ThemedText type="link" style={styles.linkTextBold}>
                    Créer un compte
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </Animated.View>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    paddingTop: 24,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
  },
  subtitle: {
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.7,
    fontSize: 16,
  },
  form: {
    gap: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  linkButton: {
    marginTop: 8,
    alignItems: 'center',
    padding: 12,
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.8,
  },
  linkTextBold: {
    fontWeight: '600',
  },
});
