import { ConfigModule } from '@nestjs/config';

import { Module } from '@nestjs/common';
import { UserController } from '@controllers/user.controller';
import { AboutController } from '@controllers/about.controller';
import { UsersService } from '@services/user.service';
import { PrismaService } from '@services/prisma.service';
import { HealthController } from '@controllers/health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, AboutController, UserController],
  providers: [PrismaService, UsersService],
})
export class AppModule {}
