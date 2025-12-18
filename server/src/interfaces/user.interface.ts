export interface AuthenticatedUser {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  provider: string;
  provider_id: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
