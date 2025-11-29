import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { DatabaseModule } from '@common/database/database.module';
import { DiscordOAuthStrategy } from '@auth/strategies/discord.strategy';
import { GoogleOAuthStrategy } from '@auth/strategies/google.strategy';
import { GithubOAuthStrategy } from '@auth/strategies/github.strategy';
import { JwtStrategy } from '@auth/strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleAuthGuard } from '@auth/guards/google-auth.guard';
import { GithubAuthGuard } from '@auth/guards/github-auth.guard';
import { DiscordAuthGuard } from '@auth/guards/discord-auth.guard';

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
    GithubOAuthStrategy,
    GoogleAuthGuard,
    GithubAuthGuard,
    DiscordAuthGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
