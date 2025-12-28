import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import {
  AboutResponse,
  AuthCredentials,
  AuthResponse,
  RegisterPayload,
  User,
  AreaModel,
  AreaActionDefinition,
  AreaReactionDefinition,
  CreateAreaPayload,
} from '@/types/api';
import { getServerUrl } from '@/utils/serverConfig';

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
   * Update the base URL (used when server URL is configured)
   */
  async updateBaseUrl(): Promise<void> {
    this.baseUrl = await getServerUrl();
  }

  /**
   * Get current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
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
      const response = await fetch(
        `${this.baseUrl}${API_ENDPOINTS.AUTH_LOGIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
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
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(
          `Impossible de se connecter au serveur. Vérifiez que l'URL est correcte: ${url}`,
        );
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const data: User[] = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a user
   * @param id - User ID
   * @param data - User data to update (e.g., { role: 'admin' })
   * @param token - JWT authentication token
   * @returns Promise with updated user
   */
  async updateUser(
    id: number,
    data: Partial<{ name?: string; email?: string; role?: string }>,
    token: string,
  ): Promise<User> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_ENDPOINTS.USERS}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const updatedUser: User = await response.json();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a user
   * @param id - User ID
   * @param token - JWT authentication token
   * @returns Promise with deleted user
   */
  async deleteUser(id: number, token: string): Promise<User> {
    try {
      const response = await fetch(
        `${this.baseUrl}${API_ENDPOINTS.USERS}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      const deletedUser: User = await response.json();
      return deletedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all AREAs for the authenticated user
   * @param token - JWT authentication token
   * @returns Promise with array of AREAs
   */
  async getAreas(token: string): Promise<AreaModel[]> {
    const res = await fetch(`${this.baseUrl}${API_ENDPOINTS.AREAS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch areas');
    return res.json();
  }

  /**
   * Get available area actions
   * @param token - JWT authentication token
   * @returns Promise with array of action definitions
   */
  async getAreaActions(token: string): Promise<AreaActionDefinition[]> {
    const res = await fetch(`${this.baseUrl}${API_ENDPOINTS.AREAS_ACTIONS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch actions');
    return res.json();
  }

  /**
   * Get available area reactions
   * @param token - JWT authentication token
   * @returns Promise with array of reaction definitions
   */
  async getAreaReactions(token: string): Promise<AreaReactionDefinition[]> {
    const res = await fetch(`${this.baseUrl}${API_ENDPOINTS.AREAS_REACTIONS}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch reactions');
    return res.json();
  }

  /**
   * Create a new AREA
   * @param payload - AREA creation payload
   * @param token - JWT authentication token
   * @returns Promise with created AREA
   */
  async createArea(payload: CreateAreaPayload, token: string): Promise<AreaModel> {
    const res = await fetch(`${this.baseUrl}${API_ENDPOINTS.AREAS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create area');
    return res.json();
  }

  /**
   * Update an AREA (name or is_active)
   * @param id - AREA ID
   * @param payload - Update payload with name and/or is_active
   * @param token - JWT authentication token
   * @returns Promise with updated AREA
   */
  async updateArea(
    id: number,
    payload: { name?: string; is_active?: boolean },
    token: string,
  ): Promise<AreaModel> {
    const res = await fetch(`${this.baseUrl}${API_ENDPOINTS.AREAS}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update area');
    return res.json();
  }

  /**
   * Delete an AREA
   * @param id - AREA ID
   * @param token - JWT authentication token
   * @returns Promise<void>
   */
  async deleteArea(id: number, token: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}${API_ENDPOINTS.AREAS}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete area');
  }

  /**
   * Get available OAuth providers
   * @returns Promise with array of provider names
   */
  async getOAuthProviders(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH_PROVIDERS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { providers: string[] } = await response.json();
      return Array.isArray(data.providers) ? data.providers : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get linked OAuth providers for authenticated user
   * @param token - JWT authentication token
   * @returns Promise with array of linked provider names
   */
  async getLinkedProviders(token: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH_PROVIDERS_LINKED}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          return [];
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { providers: string[] } = await response.json();
      return Array.isArray(data.providers) ? data.providers : [];
    } catch (error) {
      return [];
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

apiService.updateBaseUrl().catch(() => {
});
