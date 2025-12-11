import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { User } from '@prisma/client';
import {
  NormalizedOAuthProfile,
  OAuthTokens,
  OAuthValidationResult,
  AuthenticatedUser,
  OAuthProvider,
} from '@interfaces/oauth.types';
import { RegisterDto, LoginDto, AuthResponseDto } from '@dto/oauth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@interfaces/roles';

type UserSelect = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'created_at' | 'updated_at'
>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(
    profile: NormalizedOAuthProfile,
    tokens: OAuthTokens,
  ): Promise<OAuthValidationResult> {
    try {
      const { email, provider, provider_id } = profile;

      if (!email) {
        throw new Error('Email not provided by OAuth provider');
      }

      let user = await this.findUserByProviderId(provider, provider_id);

      if (!user) {
        const existingUser = await this.findByEmail(email);

        if (existingUser) {
          user = await this.linkOAuthProvider(
            existingUser.id,
            provider,
            provider_id,
            tokens,
          );
        }
      }

      if (!user) {
        user = await this.createUserFromOAuth(profile, tokens);
      }

      return this.mapToAuthenticatedUser(user);
    } catch (error) {
      console.error('[AuthService] validateOAuthLogin error:', error);
      throw error;
    }
  }

  private async findUserByProviderId(
    provider: OAuthProvider,
    provider_id: string,
  ): Promise<UserSelect | null> {
    const account = await this.prisma.providerAccount.findFirst({
      where: {
        provider: provider.toString(),
        provider_id,
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
    tokens: OAuthTokens,
  ): Promise<UserSelect> {
    const user = await this.prisma.user.create({
      data: {
        email: profile.email,
        name: profile.displayName || null,
        role: Roles.USER,
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
        provider_id: profile.provider_id,
        user_id: user.id,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken ?? null,
      },
    });

    return user;
  }

  private async linkOAuthProvider(
    user_id: number,
    provider: OAuthProvider,
    provider_id: string,
    tokens: OAuthTokens,
  ): Promise<UserSelect | null> {
    await this.prisma.providerAccount.create({
      data: {
        provider: provider.toString(),
        provider_id,
        user_id,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken ?? null,
      },
    });

    return this.prisma.user.findUnique({
      where: { id: user_id },
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

  private mapToAuthenticatedUser(
    user: UserSelect,
    account?: { provider: string; provider_id: string } | null,
  ): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      avatar: undefined,
      provider: account?.provider ?? 'local',
      provider_id: account?.provider_id ?? '',
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async hasLinkedProvider(
    user_id: number,
    provider: OAuthProvider,
  ): Promise<boolean> {
    const account = await this.prisma.providerAccount.findFirst({
      where: {
        user_id,
        provider: provider.toString(),
      },
    });
    return !!account;
  }

  async unlinkProvider(user_id: number): Promise<void> {
    await this.prisma.providerAccount.deleteMany({
      where: { user_id },
    });
  }

  async getUsersByProvider(
    provider: OAuthProvider,
  ): Promise<AuthenticatedUser[]> {
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
        provider_id: account.provider_id,
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
        role: Roles.USER,
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
    };
  }
}
