export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  is_oauth: boolean;
  created_at: string;
}

export interface Action {
  id: number;
  service_id: number;
  name: string;
  description: string;
  parameters?: Record<string, any>;
  created_at: string;
}

export interface Reaction {
  id: number;
  service_id: number;
  name: string;
  description: string;
  parameters?: Record<string, any>;
  created_at: string;
}

export interface Area {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  action_id: number;
  action_config?: Record<string, any>;
  reaction_id: number;
  reaction_config?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAreaData {
  name: string;
  description?: string;
  action_id: number;
  action_config?: Record<string, any>;
  reaction_id: number;
  reaction_config?: Record<string, any>;
}

export interface AboutResponse {
  client: {
    host: string;
  };
  server: {
    current_time: number;
    uptime?: number;
    version?: string;
    services: AboutService[];
  };
}

export interface AboutService {
  name: string;
  actions: AboutAction[];
  reactions: AboutReaction[];
}

export interface AboutAction {
  name: string;
  description: string;
}

export interface AboutReaction {
  name: string;
  description: string;
}
