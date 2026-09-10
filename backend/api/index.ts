import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';

import { AppModule } from '../src/app.module';

const server = express();

let app: any;

async function bootstrap() {
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  nestApp.use(cookieParser());

  nestApp.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Cookie',
    ],
    exposedHeaders: ['Set-Cookie'],
  });

  const config = new DocumentBuilder()
    .setTitle('POS API')
    .setDescription('API untuk sistem POS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);

  SwaggerModule.setup('docs', nestApp, document);

  await nestApp.init();

  return nestApp;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
) {
  if (!app) {
    app = await bootstrap();
  }

  return server(req, res);
}
