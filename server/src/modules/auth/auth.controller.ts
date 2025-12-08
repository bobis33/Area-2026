import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { URL } from 'url';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedUser, OAuthProvider } from '@auth/interfaces/oauth.types';
import {
  AuthResponseDto,
  AuthStatusDto,
  LoginDto,
  RegisterDto,
} from '@auth/dto/oauth.dto';
import { getEnabledProviders } from '@auth/config/oauth-providers.config';
import { AuthService } from '@auth/auth.service';
import { DiscordAuthGuard } from '@auth/guards/discord-auth.guard';
import { GithubAuthGuard } from '@auth/guards/github-auth.guard';
import { GoogleAuthGuard } from '@auth/guards/google-auth.guard';

type RequestWithUser = Request & {
  user?: AuthenticatedUser;
  logout: (callback: (err?: any) => void) => void;
  session: {
    destroy: (callback: (err?: any) => void) => void;
  };
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly enabledProviders: OAuthProvider[];

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.enabledProviders = getEnabledProviders(this.configService);
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get available OAuth providers' })
  @ApiResponse({ status: HttpStatus.OK })
  getProviders(): { providers: string[] } {
    return { providers: this.enabledProviders };
  }

  @Get('discord')
  @UseGuards(DiscordAuthGuard)
  @ApiOperation({ summary: 'Discord OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  discordAuth(): void {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  googleAuth(): void {}

  @Get('github')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'GitHub OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  githubAuth(): void {}

  @Get('discord/callback')
  @UseGuards(DiscordAuthGuard)
  @ApiOperation({ summary: 'Discord callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  discordCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  googleCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'GitHub callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  githubCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  private isValidRedirectUrl(url: string): boolean {
    // Define allowed redirect URLs
    const allowedHosts = [
      'localhost',
      '127.0.0.1',
      this.configService
        .get<string>('FRONTEND_URL')
        ?.replace(/^https?:\/\//, ''),
    ].filter(Boolean);

    const allowedSchemes = ['http:', 'https:', 'area:', 'exp:'];

    try {
      // Handle custom mobile schemes
      if (url.startsWith('area://') || url.startsWith('exp://')) {
        return true;
      }

      const parsedUrl = new URL(url);

      // Check if scheme is allowed
      if (!allowedSchemes.includes(parsedUrl.protocol)) {
        return false;
      }

      // For http/https, check if hostname is in allowlist
      if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
        const hostname = parsedUrl.hostname;
        return allowedHosts.some(
          (allowed) =>
            hostname === allowed ||
            hostname.endsWith(`.${allowed}`) ||
            // Allow expo development URLs
            hostname.includes('auth.expo.io'),
        );
      }

      return true;
    } catch {
      return false;
    }
  }

  private handleCallback(req: RequestWithUser, res: Response): void {
    const defaultFrontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8081';

    const redirectFromQuery = req.query?.redirect as string | undefined;
    const redirectFromState = req.query?.state as string | undefined;

    const redirectParam = redirectFromState || redirectFromQuery || '';

    let baseUrl = defaultFrontendUrl;

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
      baseUrl.startsWith('area://') ||
      baseUrl.includes('auth.expo.io') ||
      baseUrl.startsWith('exp://');

    if (!req.user) {
      const message = encodeURIComponent('Authentication failed');
      const errorUrl = isMobile
        ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}message=${message}`
        : `${baseUrl}/auth/error?message=${message}`;
      return res.redirect(errorUrl);
    }

    const token = this.authService.generateToken({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name || null,
      role: req.user.role,
      created_at: req.user.created_at,
      updated_at: req.user.updated_at,
    });

    const userJson = encodeURIComponent(JSON.stringify(req.user));
    const tokenParam = encodeURIComponent(token);

    const redirectUrl = isMobile
      ? `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}user=${userJson}&token=${tokenParam}`
      : `${baseUrl}/auth/success?user=${userJson}&token=${tokenParam}`;

    return res.redirect(redirectUrl);
  }

  @Get('status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check authentication status' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthStatusDto })
  status(@Req() req: RequestWithUser): AuthStatusDto {
    return {
      authenticated: !!req.user,
      user: req.user,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register with email/password' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AuthResponseDto })
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.authService.register(dto);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unknown error occurred', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email/password' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthResponseDto })
  async login(@Body() dto: LoginDto) {
    try {
      return await this.authService.login(dto);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(
        'Unknown error occurred',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: HttpStatus.OK })
  logout(@Req() req: RequestWithUser, @Res() res: Response): void {
    req.logout((err?: Error) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Error during logout',
          error: err.message,
        });
      }

      req.session.destroy((destroyErr?: Error) => {
        if (destroyErr) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'Error destroying session',
            error: destroyErr.message,
          });
        }

        res.clearCookie('connect.sid');
        return res.status(HttpStatus.OK).json({
          message: 'Logged out successfully',
        });
      });
    });
  }
}
