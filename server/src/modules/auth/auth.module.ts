import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { DatabaseModule } from '@common/database/database.module';
import {
  DiscordOAuthStrategy,
  GoogleOAuthStrategy,
  GitHubOAuthStrategy,
  SpotifyOAuthStrategy,
  GitLabOAuthStrategy,
} from '@modules/auth/strategies/oauth-strategy.factory';
import { JwtStrategy } from '@modules/auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GithubAuthGuard } from '@modules/auth/guards/github-auth.guard';
import { SpotifyAuthGuard } from '@modules/auth/guards/spotify-auth.guard';
import { GitlabAuthGuard } from '@modules/auth/guards/gitlab-auth.guard';
import { DiscordAuthGuard } from '@modules/auth/guards/discord-auth.guard';
import { GoogleAuthGuard } from '@modules/auth/guards/google-auth.guard';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    ConfigModule,
    DatabaseModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    DiscordOAuthStrategy,
    GoogleOAuthStrategy,
    GitHubOAuthStrategy,
    SpotifyOAuthStrategy,
    GitLabOAuthStrategy,
    DiscordAuthGuard,
    GithubAuthGuard,
    GoogleAuthGuard,
    SpotifyAuthGuard,
    GitlabAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
