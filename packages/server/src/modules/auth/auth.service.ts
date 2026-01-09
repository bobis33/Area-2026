import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma.service';
import { User } from '@pcg/client';
import {
  NormalizedOAuthProfile,
  OAuthTokens,
  OAuthValidationResult,
  OAuthProvider,
} from '@interfaces/oauth.interface';
import { RegisterDto, LoginDto, AuthResponseDto } from '@dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RolesInterface } from '@interfaces/roles.interface';
import { AuthenticatedUser } from '@interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';
import { Request, Response } from 'express';

type UserSelect = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'created_at' | 'updated_at'
>;

export type RequestWithUser = Request & {
  user?: AuthenticatedUser;
  logout: (callback: (err?: any) => void) => void;
  session: {
    destroy: (callback: (err?: any) => void) => void;
  };
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private isValidRedirectUrl(url: string): boolean {
    const allowedUrls = [
      this.configService.get<string>('FRONTEND_URLS'),
    ].filter(Boolean) as string[];

    if (url.startsWith('area://') || url.startsWith('exp://')) {
      return true;
    }

    try {
      const parsedUrl = new URL(url);

      const urlOrigin = parsedUrl.origin;

      return allowedUrls.some((allowed) => {
        if (!allowed) return false;
        try {
          const allowedUrl = new URL(allowed);
          return urlOrigin === allowedUrl.origin;
        } catch {
          return false;
        }
      });
    } catch {
      return false;
    }
  }

  public handleCallback(req: RequestWithUser, res: Response): void {
    const redirectFromQuery = req.query?.redirect as string | undefined;
    const redirectFromState = req.query?.state as string | undefined;

    const redirectParam = redirectFromState || redirectFromQuery || '';

    let baseUrl = 'http://localhost:8081';

    if (redirectParam) {
      try {
        const decodedUrl = decodeURIComponent(redirectParam);
        if (this.isValidRedirectUrl(decodedUrl)) {
          baseUrl = decodedUrl;
        } else {
          console.warn(`Invalid redirect URL attempted: ${decodedUrl}`);
        }
      } catch {
        console.warn(`Failed to decode redirect URL: ${redirectParam}`);
      }
    }

    const isMobile =
      baseUrl.startsWith('area://') || baseUrl.startsWith('exp://');

    if (!req.user) {
      return res.redirect(
        `${baseUrl}/auth/error?message=${encodeURIComponent('Authentication failed')}`,
      );
    }

    const token = this.generateToken({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name || null,
      role: req.user.role,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
    });

    const userJson = encodeURIComponent(JSON.stringify(req.user));
    const tokenParam = encodeURIComponent(token);

    let redirectUrl: string;
    if (isMobile) {
      redirectUrl = `${baseUrl}?user=${userJson}&token=${tokenParam}`;
    } else {
      redirectUrl = `${baseUrl}/auth/success?user=${userJson}&token=${tokenParam}`;
    }

    return res.redirect(redirectUrl);
  }

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
      } else {
        const existingProviderAccount =
          await this.prisma.providerAccount.findFirst({
            where: {
              user_id: user.id,
              provider: provider.toString(),
              provider_id,
            },
          });
        if (existingProviderAccount) {
          await this.updateProviderAccountLastUsed(
            provider,
            provider_id,
            tokens,
          );
        } else {
          await this.linkOAuthProvider(user.id, provider, provider_id, tokens);
        }
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
        role: RolesInterface.USER,
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
    const existingAccount = await this.prisma.providerAccount.findFirst({
      where: {
        user_id,
        provider: provider.toString(),
        provider_id,
      },
    });
    if (!existingAccount) {
      await this.prisma.providerAccount.create({
        data: {
          provider: provider.toString(),
          provider_id,
          user_id,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken ?? null,
        },
      });
    } else {
      await this.updateProviderAccountLastUsed(provider, provider_id, tokens);
    }
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

  private async updateProviderAccountLastUsed(
    provider: OAuthProvider,
    provider_id: string,
    tokens: OAuthTokens,
  ): Promise<void> {
    await this.prisma.providerAccount.updateMany({
      where: {
        provider: provider.toString(),
        provider_id,
      },
      data: {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken ?? null,
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

  private generateToken(user: UserSelect) {
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
        role: RolesInterface.USER,
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

  async getProvidersByUserId(user_id: number): Promise<OAuthProvider[]> {
    const accounts = await this.prisma.providerAccount.findMany({
      where: { user_id },
    });
    const providers: OAuthProvider[] = [];
    for (const account of accounts) {
      const providerStr = account.provider.toLowerCase();
      const provider = providerStr as OAuthProvider;
      if (Object.values(OAuthProvider).includes(provider)) {
        providers.push(provider);
      }
    }
    return providers;
  }

  async unlinkProvider(
    user_id: number,
    provider: OAuthProvider,
  ): Promise<void> {
    await this.prisma.providerAccount.deleteMany({
      where: {
        user_id,
        provider: provider.toString(),
      },
    });
  }
}
