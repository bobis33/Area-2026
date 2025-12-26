/**
 * Generic API response wrapper
 * Used to standardize all API responses across the application
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Error structure
 * Contains error details from failed API calls
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

/**
 * Fetch options with common configurations
 */
export interface FetchOptions extends RequestInit {
  token?: string;
}
