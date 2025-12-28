/**
 * API Configuration
 * Base URL for the backend server
 *
 * Priority:
 * 1. EXPO_PUBLIC_API_URL (full URL if provided)
 * 2. EXPO_PUBLIC_API_PORT (construct URL with port)
 * 3. Default: http://localhost:8080
 */
const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const apiPort = process.env.EXPO_PUBLIC_API_PORT || '8080';
  return `http://localhost:${apiPort}`;
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  ABOUT: '/about.json',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_PROVIDERS: '/auth/providers',
  AUTH_PROVIDERS_LINKED: '/auth/providersLinked',
  USERS: '/users',
  AREAS: '/areas',
  AREAS_ACTIONS: '/areas/actions',
  AREAS_REACTIONS: '/areas/reactions',
} as const;

