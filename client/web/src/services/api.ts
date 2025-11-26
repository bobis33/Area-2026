import type { ApiError, FetchOptions } from "@/types/api";

/**
 * Base API URL from environment variables
 */
const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Generic API request wrapper using fetch
 * Handles authentication, headers, and error management
 *
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options including optional token
 * @returns Parsed JSON response
 * @throws ApiError on HTTP errors or network issues
 */
export async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (fetchOptions.headers) {
    Object.assign(headers, fetchOptions.headers);
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        //If not a JSON response, keep the original message
      }

      const error: ApiError = {
        message: errorMessage,
        statusCode: response.status,
      };

      throw error;
    }

    //handle responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {} as T;
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && "statusCode" in error) {
      throw error as ApiError;
    }
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : "Network error",
      statusCode: 0,
    };

    throw apiError;
  }
}

/**
 * Helper function for GET requests
 */
export async function get<T>(endpoint: string, token?: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET", token });
}

/**
 * Helper function for POST requests
 */
export async function post<T>(
  endpoint: string,
  data?: unknown,
  token?: string,
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * Helper function for PUT requests
 */
export async function put<T>(
  endpoint: string,
  data?: unknown,
  token?: string,
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

/**
 * Helper function for DELETE requests
 */
export async function del<T>(endpoint: string, token?: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: "DELETE", token });
}
