/**
 * Authentication service
 * Handles all authentication-related business logic
 */

import { get, post } from '@/services/api';
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types';
import { setAuthToken, setUser, clearAuthData } from '@/utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Login with email and password
 * Stores token and user data in localStorage
 */
export async function login(
  credentials: LoginCredentials,
): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/login', credentials);

  // Store authentication data
  setAuthToken(response.token);
  setUser(response.user);

  return response;
}

/**
 * Register new user with email and password
 * Stores token and user data in localStorage
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await post<AuthResponse>('/auth/register', data);

  // Store authentication data
  setAuthToken(response.token);
  setUser(response.user);

  return response;
}

/**
 * Initiate OAuth login flow
 * Redirects to the OAuth provider (Google, Discord, GitHub)
 */
export function loginWithOAuth(
  provider: 'google' | 'discord' | 'github' | 'spotify' | 'gitlab',
): void {
  window.location.href = `${API_BASE_URL}/auth/${provider}`;
}

/**
 * Handle OAuth callback
 * Parses user data from URL and stores it
 */
export function handleOAuthCallback(userParam: string): void {
  const user = JSON.parse(decodeURIComponent(userParam));

  if (!user || !user.id || !user.email) {
    throw new Error('Invalid user data received from OAuth provider');
  }

  // OAuth uses session-based auth, so we only store user info
  // The session cookie is already set by the backend
  setUser(user);
}

/**
 * Logout current user
 * Clears all authentication data from localStorage
 */
export function logout(): void {
  clearAuthData();
}

/**
 * Get list of available OAuth providers from backend
 */
export async function getOAuthProviders(): Promise<string[]> {
  try {
    const response = await get<{ providers: string[] }>('/auth/providers');
    return response.providers;
  } catch (error) {
    console.error('Failed to fetch OAuth providers:', error);
    return [];
  }
}
