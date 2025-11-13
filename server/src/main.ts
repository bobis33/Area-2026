import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';
import { RequestMethod } from '@nestjs/common';

async function main() {
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
    `🚀 Server running on http://localhost:${port}/api\n
    📘 Swagger docs available at http://localhost:${port}/api/docs`,
  );
}
main();
