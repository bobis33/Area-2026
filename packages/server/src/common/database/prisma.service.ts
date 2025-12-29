import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@pcg/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      adapter: new PrismaPg({
        connectionString: process.env.POSTGRES_URL,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
