import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { User } from '@prisma/client';
import {
  NormalizedOAuthProfile,
  OAuthTokens,
  OAuthValidationResult,
  AuthenticatedUser,
  OAuthProvider,
} from '@auth/interfaces/oauth.types';
import { RegisterDto, LoginDto, AuthResponseDto } from '@auth/dto/oauth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

type UserSelect = Pick<
    User,
    'id' | 'email' | 'name' | 'role' | 'created_at' | 'updated_at'
>;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async validateOAuthLogin(
    profile: NormalizedOAuthProfile,
    tokens: OAuthTokens,
  ): Promise<OAuthValidationResult> {
    try {
      const { email, provider, providerId } = profile;

      if (!email) {
        throw new Error('Email not provided by OAuth provider');
      }

      let user = await this.findUserByProviderId(provider, providerId);

      if (!user) {
        const existingUser = await this.findByEmail(email);

        if (existingUser) {
          user = await this.linkOAuthProvider(
            existingUser.id,
            provider,
            providerId,
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

    private async findUserByProviderId(
        provider: OAuthProvider,
        providerId: string,
    ): Promise<UserSelect | null> {
        const account = await this.prisma.providerAccount.findFirst({
            where: {
                provider: provider.toString(),
                providerId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            },
        });

        return account?.user ?? null;
    }


    async findByEmail(email: string): Promise<UserSelect | null> {
        return this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true,
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
        created_at: true,
        updated_at: true,
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
        const user = await this.prisma.user.create({
            data: {
                email: profile.email,
                name: profile.displayName || null,
                role: 'user',
                password: null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        await this.prisma.providerAccount.create({
            data: {
                provider: profile.provider.toString(),
                providerId: profile.providerId,
                userId: user.id,
            },
        });

        return user;
    }

    private async linkOAuthProvider(
        userId: number,
        provider: OAuthProvider,
        providerId: string,
    ): Promise<UserSelect | null> {
        await this.prisma.providerAccount.create({
            data: {
                provider: provider.toString(),
                providerId,
                userId,
            },
        });

        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true,
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

    private mapToAuthenticatedUser(
        user: UserSelect,
        account?: { provider: string; providerId: string } | null,
    ): AuthenticatedUser {
        return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            avatar: undefined,
            provider: account?.provider ?? 'local',
            providerId: account?.providerId ?? '',
            role: user.role,
            createdAt: user.created_at,
        };
    }


    async hasLinkedProvider(userId: number, provider: OAuthProvider): Promise<boolean> {
        const account = await this.prisma.providerAccount.findFirst({
            where: {
                userId,
                provider: provider.toString(),
            },
        });
        return !!account;
    }


    async unlinkProvider(userId: number): Promise<void> {
        await this.prisma.providerAccount.deleteMany({
            where: { userId },
        });
    }


    async getUsersByProvider(provider: OAuthProvider): Promise<AuthenticatedUser[]> {
        const accounts = await this.prisma.providerAccount.findMany({
            where: { provider: provider.toString() },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        role: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            },
        });

        return accounts.map((account) =>
            this.mapToAuthenticatedUser(account.user, {
                provider: account.provider,
                providerId: account.providerId,
            }),
        );
    }

    generateToken(user: UserSelect) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
            role: user.role,
        });
    }

    async register(dto: RegisterDto): Promise<AuthResponseDto> {
        const exists = await this.findByEmail(dto.email);
        if (exists) {
            throw new Error('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: dto.name,
                password: hashedPassword,
                role: 'user',
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        return {
            user: this.mapToAuthenticatedUser(user),
            token: this.generateToken(user),
        };
  }

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }

        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) {
            throw new Error('Invalid credentials');
        }

        return {
            user: this.mapToAuthenticatedUser(user),
            token: this.generateToken(user),
        };    }

}
