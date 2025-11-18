import { User } from '@prisma/client';

export type UserSelect = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'provider' | 'providerId' | 'created_at'
>;

export type UserWithProvider = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'provider' | 'providerId' | 'created_at'
>;

export type UserCreateData = {
  email: string;
  name: string | null;
  provider: string;
  providerId: string;
  role: string;
  password?: string | null;
};

export type UserUpdateData = {
  provider: string;
  providerId: string;
  name?: string | null;
};
