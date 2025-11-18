import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  DiscordOAuthStrategy,
  GoogleOAuthStrategy,
  GitHubOAuthStrategy,
} from './strategies/oauth.strategy';
import { DatabaseModule } from 'common/database/database.module';

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
