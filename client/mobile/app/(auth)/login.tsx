import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@area/ui';
import {
  MobileScreen,
  MobileButton,
  MobileInput,
} from '@/components/ui-mobile';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erreur de connexion';
      setError(errorMessage);
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const hasAllFields = email.trim() && password.trim();

  return (
    <MobileScreen
      title="Bienvenue 👋"
      scroll
      safeArea
      keyboardAware
    >
      <Text
        variant="body"
        color="muted"
        align="center"
        style={{ marginBottom: 32 }}
      >
        Connectez-vous à votre compte AREA
      </Text>
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
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        disabled={loading}
        errorMessage={error && !password.trim() ? error : undefined}
      />
      {error && hasAllFields && (
        <Text
          variant="caption"
          color="danger"
          style={{ marginTop: -8, marginBottom: 8 }}
        >
          {error}
        </Text>
      )}
      <MobileButton
        label="Se connecter"
        onPress={handleLogin}
        variant="primary"
        disabled={loading}
        fullWidth
        style={{ marginTop: 8 }}
      />
      <MobileButton
        label="Créer un compte"
        onPress={() => router.push('/(auth)/register')}
        variant="ghost"
        disabled={loading}
        fullWidth
        style={{ marginTop: 8 }}
      />
    </MobileScreen>
  );
}