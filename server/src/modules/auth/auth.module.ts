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

@Module({
  imports: [
    PassportModule.register({ session: false }),
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    DiscordOAuthStrategy,
    GoogleOAuthStrategy,
    GitHubOAuthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
