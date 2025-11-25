import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: 'Connexion',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Inscription',
          headerShown: true,
        }}
      />
    </Stack>
  );
}

