import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { DiscordStrategy } from './strategies/discord.strategy';
import { DatabaseModule } from 'common/database/database.module';

@Module({
  imports: [
    PassportModule.register({ session: false }),
    ConfigModule,
    DatabaseModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GitHubStrategy, DiscordStrategy],
  exports: [AuthService],
})
export class AuthModule {}
