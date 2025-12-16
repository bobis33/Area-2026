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
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
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
import {AuthService, RequestWithUser} from '@modules/auth/auth.service';
import { DiscordAuthGuard } from '@modules/auth/guards/discord-auth.guard';
import { GithubAuthGuard } from '@modules/auth/guards/github-auth.guard';
import { GoogleAuthGuard } from '@modules/auth/guards/google-auth.guard';
import { SpotifyAuthGuard } from '@modules/auth/guards/spotify-auth.guard';
import { GitlabAuthGuard } from '@modules/auth/guards/gitlab-auth.guard';

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
    this.authService.handleCallback(req, res);
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  googleCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.authService.handleCallback(req, res);
  }

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  @ApiOperation({ summary: 'GitHub callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  githubCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.authService.handleCallback(req, res);
  }

  @Get('spotify/callback')
  @UseGuards(SpotifyAuthGuard)
  @ApiOperation({ summary: 'Spotify callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  spotifyCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.authService.handleCallback(req, res);
  }

  @Get('gitlab/callback')
  @UseGuards(GitlabAuthGuard)
  @ApiOperation({ summary: 'GitLab callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  gitlabCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.authService.handleCallback(req, res);
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
