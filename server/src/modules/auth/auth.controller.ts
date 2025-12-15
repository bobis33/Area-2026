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
import { OAuthProvider } from '@interfaces/oauth';
import {
  AuthResponseDto,
  AuthStatusDto,
  LoginDto,
  RegisterDto,
} from '@dto/auth.dto';
import { getEnabledProviders } from '@modules/auth/config/oauth-providers.config';
import { AuthService } from '@modules/auth/auth.service';
import { DiscordAuthGuard } from '@modules/auth/guards/discord-auth.guard';
import { GithubAuthGuard } from '@modules/auth/guards/github-auth.guard';
import { GoogleAuthGuard } from '@modules/auth/guards/google-auth.guard';
import { SpotifyAuthGuard } from '@modules/auth/guards/spotify-auth.guard';
import { GitlabAuthGuard } from '@modules/auth/guards/gitlab-auth.guard';
import { AuthenticatedUser } from '@interfaces/user';

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

  @Get('gitlab')
  @UseGuards(GitlabAuthGuard)
  @ApiOperation({ summary: 'GitLab OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  gitlabAuth(): void {}

  @Get('spotify')
  @UseGuards(SpotifyAuthGuard)
  @ApiOperation({ summary: 'Spotify OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  spotifyAuth(): void {}

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

  @Get('spotify/callback')
  @UseGuards(SpotifyAuthGuard)
  @ApiOperation({ summary: 'Spotify callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  spotifyCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  @Get('gitlab/callback')
  @UseGuards(GitlabAuthGuard)
  @ApiOperation({ summary: 'GitLab callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  gitlabCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

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

  private handleCallback(req: RequestWithUser, res: Response): void {
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

    let redirectUrl: string;
    if (isMobile) {
      redirectUrl = `${baseUrl}?user=${userJson}&token=${tokenParam}`;
    } else {
      redirectUrl = `${baseUrl}/auth/success?user=${userJson}&token=${tokenParam}`;
    }

    return res.redirect(redirectUrl);
  }

  @Get('providersLinked')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get linked OAuth providers for authenticated user' })
  @ApiResponse({ status: HttpStatus.OK, type: [String] })
  async getLinkedProviders(@Req() req: RequestWithUser): Promise<{ providers: OAuthProvider[] }> {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const providers = await this.authService.getProvidersByUserId(req.user.id);
    return { providers };
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
  @ApiBearerAuth()
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
