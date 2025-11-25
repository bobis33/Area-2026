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
  // If full URL is provided, use it
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // If only port is provided, construct URL
  const apiPort = process.env.EXPO_PUBLIC_API_PORT || '8080';
  return `http://localhost:${apiPort}`;
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  ABOUT: '/about.json',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  USERS: '/users',
} as const;

// Log the API configuration in development
if (process.env.NODE_ENV !== 'production') {
  console.log('API Configuration:', {
    baseUrl: API_BASE_URL,
    endpoints: API_ENDPOINTS,
  });
  console.warn(
    '⚠️  IMPORTANT: Sur mobile, utilisez l\'IP de votre machine au lieu de localhost.\n' +
    '   Exemple: EXPO_PUBLIC_API_URL=http://10.134.199.30:8080\n' +
    '   (Trouvez votre IP avec: ifconfig | grep "inet " | grep -v 127.0.0.1)'
  );
}

