/**
 * Type definitions for API responses
 * Based on backend DTOs from NestJS
 */

// About endpoint types
export interface AboutAction {
  name: string;
  description: string;
}

export interface AboutReaction {
  name: string;
  description: string;
}

export interface AboutService {
  name: string;
  actions: AboutAction[];
  reactions: AboutReaction[];
}

export interface AboutResponse {
  client: {
    host: string;
  };
  server: {
    current_time: number;
    uptime: number;
    version: string;
    services: AboutService[];
  };
}

// Auth types
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  provider: string;
  providerId: string;
  role: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  token: string;
}

// User types
export interface User {
  id: number;
  email: string;
  name?: string | null;
  role: string;
  created_at: Date;
  updated_at: Date;
}

