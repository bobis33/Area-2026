import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import * as Linking from 'expo-linking';
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
      const query = parsed.queryParams ?? {};

      const userParam = query.user as string | undefined;
      const tokenParam = query.token as string | undefined;
      const hasAuthParams = userParam && tokenParam;

      // Check if this is an error path
      if (
        normalizedPath === 'auth/error' ||
        normalizedPath.includes('auth/error')
      ) {
        return;
      }

      // Only process if we have both user and token parameters
      if (!hasAuthParams) {
        return;
      }

      const tokenValue = decodeURIComponent(tokenParam);
      const decodedUser = decodeURIComponent(userParam);
      const userData = JSON.parse(decodedUser) as AuthenticatedUser;

      setToken(tokenValue);
      setUser(userData);
      // Navigation will be handled by the useEffect in _layout.tsx
    } catch (error) {
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const credentials: AuthCredentials = { email, password };
      const response = await apiService.login(credentials);
      setToken(response.token);
      setUser(response.user);
      // Navigation will be handled by the useEffect in _layout.tsx
    } catch (error) {
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
