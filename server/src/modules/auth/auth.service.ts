import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { User } from '@prisma/client';
import {
  NormalizedOAuthProfile,
  OAuthTokens,
  OAuthValidationResult,
  AuthenticatedUser,
  OAuthProvider,
} from './interfaces/oauth.types';

type UserSelect = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'provider' | 'providerId' | 'created_at'
>;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateOAuthLogin(
    profile: NormalizedOAuthProfile,
    tokens: OAuthTokens,
  ): Promise<OAuthValidationResult> {
    try {
      const { email, displayName, provider, providerId } = profile;

      if (!email) {
        throw new Error('Email not provided by OAuth provider');
      }

      let user = await this.findUserByProvider(provider, providerId);

      if (!user) {
        const existingUser = await this.findByEmail(email);

        if (existingUser) {
          user = await this.linkOAuthProvider(
            existingUser.id,
            provider,
            providerId,
            displayName,
          );
        }
      }

      if (!user) {
        user = await this.createUserFromOAuth(profile);
      }

      this.updateOAuthTokens(user.id, tokens);

      return this.mapToAuthenticatedUser(user);
    } catch (error) {
      console.error('[AuthService] validateOAuthLogin error:', error);
      throw error;
    }
  }

  private async findUserByProvider(
    provider: OAuthProvider,
    providerId: string,
  ): Promise<UserSelect | null> {
    return this.prisma.user.findFirst({
      where: {
        provider: provider.toString(),
        providerId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        created_at: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserSelect | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        created_at: true,
      },
    });
  }

  async findById(id: number): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        created_at: true,
      },
    });

    if (!user) {
      return null;
    }

    return this.mapToAuthenticatedUser(user);
  }

  private async createUserFromOAuth(
    profile: NormalizedOAuthProfile,
  ): Promise<UserSelect> {
    return this.prisma.user.create({
      data: {
        email: profile.email,
        name: profile.displayName || profile.username || null,
        provider: profile.provider.toString(),
        providerId: profile.providerId,
        role: 'user',
        password: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        created_at: true,
      },
    });
  }

  private async linkOAuthProvider(
    userId: number,
    provider: OAuthProvider,
    providerId: string,
    displayName?: string,
  ): Promise<UserSelect> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        provider: provider.toString(),
        providerId,
        name: displayName || undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        created_at: true,
      },
    });
  }

  private updateOAuthTokens(userId: number, tokens: OAuthTokens): void {
    try {
      console.log(`[AuthService] Tokens received for user ${userId}`, {
        hasAccess: !!tokens.accessToken,
        hasRefresh: !!tokens.refreshToken,
      });
    } catch (error) {
      console.error('[AuthService] updateOAuthTokens error:', error);
    }
  }

  private mapToAuthenticatedUser(user: UserSelect): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      avatar: undefined,
      provider: user.provider ?? 'local',
      providerId: user.providerId ?? '',
      role: user.role,
      createdAt: user.created_at,
    };
  }

  async hasLinkedProvider(
    userId: number,
    provider: OAuthProvider,
  ): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        provider: provider.toString(),
      },
    });

    return !!user;
  }

  async unlinkProvider(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        provider: null,
        providerId: null,
      },
    });
  }

  async getUsersByProvider(
    provider: OAuthProvider,
  ): Promise<AuthenticatedUser[]> {
    const users = await this.prisma.user.findMany({
      where: {
        provider: provider.toString(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        provider: true,
        providerId: true,
        created_at: true,
      },
    });

    return users.map((user) => this.mapToAuthenticatedUser(user));
  }
}
