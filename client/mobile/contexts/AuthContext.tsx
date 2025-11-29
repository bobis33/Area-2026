import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { apiService } from '@/services/api.service';
import { AuthenticatedUser, AuthCredentials } from '@/types/api';

interface AuthContextType {
  token: string | null;
  user: AuthenticatedUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  handleOAuthRedirect: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const handleInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    handleInitialUrl();

    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = (url: string) => {
    if (!url) return;

    try {
      const parsed = Linking.parse(url);
      const path = parsed.path || '';
      const normalizedPath = path.replace(/^\/+|\/+$/g, '');
      const isAuthSuccessPath = normalizedPath === 'auth/success';
      const isAreaAuthSuccess = url.startsWith('area://auth/success');

      if (!isAuthSuccessPath && !isAreaAuthSuccess) {
        if (normalizedPath === 'auth/error') {
          const message = parsed.queryParams?.message as string | undefined;
          console.error('OAuth error:', message || 'Authentication failed');
        }
        return;
      }

      const query = parsed.queryParams ?? {};
      const userParam = query.user as string | undefined;
      const tokenParam = query.token as string | undefined;

      if (!userParam || !tokenParam) {
        console.error('Missing user or token in callback URL');
        return;
      }

      const tokenValue = decodeURIComponent(tokenParam);
      const decodedUser = decodeURIComponent(userParam);
      const userData = JSON.parse(decodedUser) as AuthenticatedUser;

      setToken(tokenValue);
      setUser(userData);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const credentials: AuthCredentials = { email, password };
      const response = await apiService.login(credentials);
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const handleOAuthRedirect = (url: string) => {
    handleDeepLink(url);
  };

  const value: AuthContextType = {
    token,
    user,
    login,
    logout,
    isAuthenticated: !!token,
    handleOAuthRedirect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

