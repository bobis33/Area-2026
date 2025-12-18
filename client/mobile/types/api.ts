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
  providerId?: string;
  provider_id?: string;
  role: string;
  createdAt: string | Date;
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
  created_at: string;
  updated_at: string;
}

// Area types
export type ParamField = {
  type: 'string' | 'number' | 'boolean';
  description?: string;
  example?: any;
  optional?: boolean;
};

export type AreaActionDefinition = {
  service: string;
  type: string;
  parameters: Record<string, ParamField> | string;
};

export type AreaReactionDefinition = {
  service: string;
  type: string;
  parameters: Record<string, ParamField> | string;
};

export type AreaModel = {
  id: number;
  name: string;
  is_active: boolean;
  action?: {
    service: string;
    type: string;
    parameters: any;
  };
  reaction?: {
    service: string;
    type: string;
    parameters: any;
  };
};

export type CreateAreaPayload = {
  name: string;
  userId: number;
  action: {
    service: string;
    type: string;
    parameters: Record<string, any>;
  };
  reaction: {
    service: string;
    type: string;
    parameters: Record<string, any>;
  };
  is_active?: boolean;
};

