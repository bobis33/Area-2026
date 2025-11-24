import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from 'app.module';
import { setupSwagger } from '@config/swagger.config';

async function app() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 8080;

  setupSwagger(app);

    const allowedOrigins = configService
        .get<string>('FRONTENDS_URL')
        ?.split(',')
        .map(origin => origin.trim()) || [];

    app.enableCors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        credentials: true,
        origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked from origin: ${origin}`);
                return callback(null, false);
            }
        },
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });

    app.use(helmet({
        crossOriginResourcePolicy: {
            policy: 'cross-origin'
        }
    }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableShutdownHooks();
  await app.listen(port);

  console.log(
    `🚀 Server running on http://localhost:${port}\n📘 Swagger docs available at http://localhost:${port}/docs`,
  );
}

app();
