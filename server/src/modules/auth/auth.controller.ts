import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OAuthProvider, AuthenticatedUser } from '@auth/interfaces/oauth.types';
import {AuthStatusDto} from '@auth/dto/oauth.dto';
import { getEnabledProviders } from '@auth/config/oauth-providers.config';

import { Post, Body, HttpException } from '@nestjs/common';
import { RegisterDto, LoginDto, AuthResponseDto } from '@auth/dto/oauth.dto';
import {AuthService} from "@auth/auth.service";

interface RequestWithUser {
  user?: AuthenticatedUser;
  logout: (callback: (err?: any) => void) => void;
  session: {
    destroy: (callback: (err?: any) => void) => void;
  };
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly frontendUrl: string;
  private readonly enabledProviders: OAuthProvider[];

  constructor(private readonly configService: ConfigService, private readonly authService: AuthService) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    this.enabledProviders = getEnabledProviders(this.configService);
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get available OAuth providers' })
  @ApiResponse({ status: HttpStatus.OK })
  getProviders(): { providers: string[] } {
    return { providers: this.enabledProviders };
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  @ApiOperation({ summary: 'Discord OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  discordAuth(): void {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  googleAuth(): void {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth' })
  @ApiResponse({ status: HttpStatus.FOUND })
  githubAuth(): void {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  @ApiOperation({ summary: 'Discord callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  discordCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  googleCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub callback' })
  @ApiResponse({ status: HttpStatus.FOUND })
  githubCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    this.handleCallback(req, res);
  }

  private handleCallback(req: RequestWithUser, res: Response): void {
    if (!req.user) {
      return res.redirect(
        `${this.frontendUrl}/auth/error?message=Authentication failed`,
      );
    }

    const userJson = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`${this.frontendUrl}/auth/success?user=${userJson}`);
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
            throw new HttpException('Unknown error occurred', HttpStatus.UNAUTHORIZED);
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
