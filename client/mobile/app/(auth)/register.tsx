import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedInput } from '@/components/ui/animated-input';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const insets = useSafeAreaInsets();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await apiService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      await login(email.trim(), password);
      
      Alert.alert('Succès', 'Compte créé avec succès !', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
      Alert.alert('Erreur d\'inscription', errorMessage);
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
          <Animated.View entering={FadeIn.delay(200)}>
            <ThemedText type="title" style={styles.title}>
              Créer un compte
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Rejoignez la communauté AREA
            </ThemedText>
          </Animated.View>

          <ThemedView style={styles.form}>
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Nom complet
              </ThemedText>
              <AnimatedInput
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(400).springify()}>
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

            <Animated.View entering={FadeInDown.delay(500).springify()}>
              <ThemedText type="defaultSemiBold" style={styles.label}>
                Mot de passe
              </ThemedText>
              <AnimatedInput
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
                keyboardType="default"
                editable={!loading}
              />
              <ThemedText style={styles.hint}>
                Minimum 6 caractères
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).springify()}>
              <AnimatedButton
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                variant="primary">
                Créer mon compte
              </AnimatedButton>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700).springify()}>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.back()}
                disabled={loading}>
                <ThemedText style={styles.linkText}>
                  Déjà un compte ?{' '}
                  <ThemedText type="link" style={styles.linkTextBold}>
                    Se connecter
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
  hint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 6,
    marginLeft: 4,
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
