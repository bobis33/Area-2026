import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('AREA API')
    .setDescription(
      `API documentation for the AREA (Automated REactions for Everyone and Anything) platform.
    AREA is a platform that allows users to create automated workflows by connecting various services through actions and reactions.`,
    )
    .setVersion('0.0.1')
    .setContact(
      'AREA Team',
      'https://github.com/bobis33/Area-2026',
      'elliot.masina@epitech.eu',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste your JWT access token here',
      },
      'jwt',
    )
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'User management')
    .addTag('areas', 'Workflow (AREA) management')
    .addTag('health', 'Health check')
    .addTag('meta', 'API metadata')
    .setLicense(
      'MIT',
      'https://github.com/bobis33/Area-2026/blob/main/LICENSE.md',
    )

    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
}
