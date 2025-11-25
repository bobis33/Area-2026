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

  app.enableCors({
    origin: ['*'],
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
