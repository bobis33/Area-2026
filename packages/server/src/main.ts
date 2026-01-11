import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from '@/app.module';
import { setupSwagger } from '@common/config/swagger.config';

async function app() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  const logger = new Logger('main');
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') ?? 8080;
  const allowedOrigins: string[] =
    configService
      .get<string>('FRONTEND_URLS')
      ?.split(',')
      .map((origin) => origin.trim()) || [];

  setupSwagger(app);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked from origin: ${origin}`);
        return callback(null, false);
      }
    },
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();
  await app.listen(port);

  logger.log(`Running on http://localhost:${port}\n`);
}

app();
