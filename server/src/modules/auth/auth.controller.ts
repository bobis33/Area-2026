import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirige automatiquement vers Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    // TODO: Générer un JWT token ici
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    // Rediriger vers le frontend avec les infos utilisateur
    return res.redirect(
      `${frontendUrl}/auth/success?user=${JSON.stringify(user)}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Redirige automatiquement vers GitHub
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    return res.redirect(
      `${frontendUrl}/auth/success?user=${JSON.stringify(user)}`,
    );
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth() {
    // Redirige automatiquement vers Discord
  }

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  discordAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    return res.redirect(
      `${frontendUrl}/auth/success?user=${JSON.stringify(user)}`,
    );
  }

  @Get('status')
  status(@Req() req: Request) {
    return {
      authenticated: !!req.user,
      user: req.user || null,
    };
  }
}
