import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { DatabaseModule } from '@common/database/database.module';
import {
  DiscordOAuthStrategy,
  GoogleOAuthStrategy,
  GitHubOAuthStrategy,
} from '@auth/strategies/oauth-strategy.factory';
import {JwtStrategy} from "@auth/strategies/jwt.strategy";
import {JwtModule} from "@nestjs/jwt";
import { ConfigService } from '@nestjs/config';

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
  ],
  exports: [AuthService],
})
export class AuthModule {}
