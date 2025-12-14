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
import { apiService } from '@/services/api.service';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
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

      Alert.alert('Succès', 'Compte créé avec succès !');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'inscription";
      setError(errorMessage);
      Alert.alert("Erreur d'inscription", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileScreen
      title="Créer un compte"
      scroll={true}
      safeArea={true}
      keyboardAware
    >
      <Text
        variant="body"
        color="muted"
        align="center"
        style={{ marginBottom: 32 }}
      >
        Rejoignez la communauté AREA
      </Text>

      <MobileInput
        label="Nom complet"
        value={name}
        onChangeText={setName}
        placeholder="John Doe"
        disabled={loading}
        errorMessage={error && !name.trim() ? error : undefined}
      />

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
        helperText="Minimum 6 caractères"
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
        label="Créer mon compte"
        onPress={handleRegister}
        variant="primary"
        disabled={loading}
        fullWidth
      />

      <MobileButton
        label="Déjà un compte ? Se connecter"
        onPress={() => router.back()}
        variant="ghost"
        disabled={loading}
        fullWidth
        style={{ marginTop: 8 }}
      />
    </MobileScreen>
  );
}
