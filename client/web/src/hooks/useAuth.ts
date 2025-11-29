/**
 * Custom React hook for authentication
 * Provides authentication state and methods throughout the application
 */

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginCredentials, RegisterData, AuthResponse } from "@/types";
import * as authService from "@/services/auth.service";
import { getUser, isAuthenticated as checkAuth } from "@/utils/storage";
import type { User } from "@/types";

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithOAuth: (provider: "google" | "discord" | "github") => void;
  logout: () => void;
  clearError: () => void;
}

/**
 * Hook for managing authentication state and operations
 *
 * @example
 * ```tsx
 * function LoginPage() {
 *   const { login, loading, error } = useAuth();
 *
 *   const handleSubmit = async (credentials) => {
 *     await login(credentials);
 *   };
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authService.login(credentials);
        setUser(response.user);
        navigate("/home");
      } catch (err: any) {
        const errorMessage =
          err.message || "Login failed. Please check your credentials.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authService.register(data);
        setUser(response.user);
        navigate("/home");
      } catch (err: any) {
        const errorMessage =
          err.message || "Registration failed. Please try again.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  /**
   * Login with OAuth provider (Google, Discord, GitHub)
   * Redirects to OAuth provider
   */
  const loginWithOAuth = useCallback(
    (provider: "google" | "discord" | "github"): void => {
      authService.loginWithOAuth(provider);
    },
    [],
  );

  /**
   * Logout current user
   */
  const logout = useCallback((): void => {
    authService.logout();
    setUser(null);
    navigate("/");
  }, [navigate]);

  /**
   * Clear error message
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: checkAuth(),
    loading,
    error,
    login,
    register,
    loginWithOAuth,
    logout,
    clearError,
  };
}
