import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@common/database/database.module';
import { UsersModule } from '@modules/users/users.module';
import { HealthModule } from '@modules/health/health.module';
import { AboutModule } from '@modules/about/about.module';
import { AuthModule } from '@modules/auth/auth.module';
import { TimeModule } from '@modules/actions/time/time.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(8080),
        JWT_SECRET: Joi.string().required(),
        FRONTEND_URLS: Joi.string().required(),
        DISCORD_CLIENT_ID: Joi.string(),
        DISCORD_CLIENT_SECRET: Joi.string(),
        DISCORD_CLIENT_CALLBACK_URL: Joi.string().uri().optional(),
        DISCORD_CLIENT_MOBILE_CALLBACK_URL: Joi.string().uri().optional(),
        GOOGLE_CLIENT_ID: Joi.string(),
        GOOGLE_CLIENT_SECRET: Joi.string(),
        GOOGLE_CLIENT_CALLBACK_URL: Joi.string().uri().optional(),
        GOOGLE_CLIENT_MOBILE_CALLBACK_URL: Joi.string().uri().optional(),
        GITHUB_CLIENT_ID: Joi.string(),
        GITHUB_CLIENT_SECRET: Joi.string(),
        GITHUB_CLIENT_CALLBACK_URL: Joi.string().uri().optional(),
        GITHUB_CLIENT_MOBILE_ID: Joi.string(),
        GITHUB_CLIENT_MOBILE_SECRET: Joi.string(),
        GITHUB_CLIENT_MOBILE_CALLBACK_URL: Joi.string().uri().optional(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    DatabaseModule,
    UsersModule,
    HealthModule,
    AboutModule,
    AuthModule,
    TimeModule,
  ],
})
export class AppModule {}
