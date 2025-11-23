import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@common/database/database.module';
import { UsersModule } from '@/users/users.module';
import { HealthModule } from '@/health/health.module';
import { AboutModule } from '@/about/about.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    HealthModule,
    AboutModule,
    AuthModule,
  ],
})
export class AppModule {}
