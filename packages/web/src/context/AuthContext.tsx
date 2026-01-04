import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "@/types";
import * as authService from "@/services/auth.service";
import { getUser, isAuthenticated as checkAuth } from "@/utils/storage";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithOAuth: (
    provider: "google" | "discord" | "github" | "spotify" | "gitlab",
  ) => void;
  logout: () => void;
  clearError: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh auth state from storage
  const refreshAuth = useCallback(() => {
    const storedUser = getUser();
    const authenticated = checkAuth();
    setUser(storedUser);
    setIsAuthenticated(authenticated);
  }, []);

  // Check auth state on mount and when storage changes
  useEffect(() => {
    refreshAuth();

    // Listen for storage changes (e.g., from OAuth callback)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-window updates
    const handleAuthChange = () => {
      refreshAuth();
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, [refreshAuth]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authService.login(credentials);
        setUser(response.user);
        setIsAuthenticated(true);

        // Dispatch custom event
        window.dispatchEvent(new Event("auth-change"));

        navigate("/dashboard");
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

  const register = useCallback(
    async (data: RegisterData): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authService.register(data);
        setUser(response.user);
        setIsAuthenticated(true);

        // Dispatch custom event
        window.dispatchEvent(new Event("auth-change"));

        navigate("/dashboard");
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

  const loginWithOAuth = useCallback(
    (
      provider: "google" | "discord" | "github" | "spotify" | "gitlab",
    ): void => {
      authService.loginWithOAuth(provider);
    },
    [],
  );

  const logout = useCallback((): void => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);

    // Dispatch custom event
    window.dispatchEvent(new Event("auth-change"));

    navigate("/");
  }, [navigate]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    loginWithOAuth,
    logout,
    clearError,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
