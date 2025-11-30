/**
 * Utility functions for managing localStorage operations
 * Provides type-safe access to stored authentication data
 */

import type { User } from "@/types";

const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
} as const;

/**
 * Store authentication token in localStorage
 */
export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error("Failed to store auth token:", error);
  }
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("Failed to retrieve auth token:", error);
    return null;
  }
}

/**
 * Remove authentication token from localStorage
 */
export function removeAuthToken(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error("Failed to remove auth token:", error);
  }
}

/**
 * Store user data in localStorage
 */
export function setUser(user: User): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user data:", error);
  }
}

/**
 * Get user data from localStorage
 */
export function getUser(): User | null {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Failed to retrieve user data:", error);
    return null;
  }
}

/**
 * Remove user data from localStorage
 */
export function removeUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error("Failed to remove user data:", error);
  }
}

/**
 * Clear all authentication data from localStorage
 */
export function clearAuthData(): void {
  removeAuthToken();
  removeUser();
}

/**
 * Check if user is authenticated (has token or session)
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  const user = getUser();

  return !!(token || user);
}
