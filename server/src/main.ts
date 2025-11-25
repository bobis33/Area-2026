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

  app.use(helmet());

    const allowedOrigins = configService
        .get<string>('FRONTENDS_URL')
        ?.split(',')
        .map(origin => origin.trim()) || [];

    app.enableCors({
        origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
    });


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);

  console.log(
    `🚀 Server running on http://localhost:${port}\n📘 Swagger docs available at http://localhost:${port}/docs`,
  );
}

app();
