import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the Auth Service')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
};
