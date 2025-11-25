import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import {
  AboutResponse,
  AuthCredentials,
  AuthResponse,
  RegisterPayload,
  User,
} from '@/types/api';

/**
 * API Service
 * Handles HTTP requests to the backend API
 */
class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Fetch server information from /about.json endpoint
   * @returns Promise with server information including services, actions, and reactions
   */
  async getAbout(): Promise<AboutResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ABOUT}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AboutResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching about data:', error);
      throw error;
    }
  }

  /**
   * Login with email and password
   * @param credentials - Email and password
   * @returns Promise with user data and JWT token
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param payload - Registration data (email, name, password)
   * @returns Promise with user data and JWT token
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const url = `${this.baseUrl}${API_ENDPOINTS.AUTH_REGISTER}`;
    console.log('Register URL:', url);
    console.log('Register payload:', { ...payload, password: '***' });
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Register response status:', response.status);
      console.log('Register response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Register error data:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Impossible de se connecter au serveur. Vérifiez que l'URL est correcte: ${url}`);
      }
      throw error;
    }
  }

  /**
   * Get list of users
   * @param token - JWT authentication token
   * @returns Promise with array of users
   */
  async getUsers(token: string): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.USERS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: User[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

