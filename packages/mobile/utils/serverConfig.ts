import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_URL_KEY = 'area_server_url';

/**
 * Get the configured server URL or return default
 */
export const getServerUrl = async (): Promise<string> => {
  try {
    const savedUrl = await AsyncStorage.getItem(SERVER_URL_KEY);
    if (savedUrl) {
      return savedUrl;
    }
  } catch (error) {
  }
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const apiPort = process.env.EXPO_PUBLIC_API_PORT || '8080';
  return `http://localhost:${apiPort}`;
};

/**
 * Save the server URL
 */
export const saveServerUrl = async (url: string): Promise<void> => {
  try {
    const trimmedUrl = url.trim();
    if (trimmedUrl && !trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      throw new Error('URL must start with http:// or https://');
    }
    if (trimmedUrl) {
      await AsyncStorage.setItem(SERVER_URL_KEY, trimmedUrl);
    } else {
      await AsyncStorage.removeItem(SERVER_URL_KEY);
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Reset to default server URL
 */
export const resetServerUrl = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SERVER_URL_KEY);
  } catch (error) {
    throw error;
  }
};

