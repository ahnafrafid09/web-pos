import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // =========================
  // GLOBAL VALIDATION
  // =========================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // =========================
  // COOKIE PARSER
  // =========================
  app.use(cookieParser());

  // =========================
  // CORS
  // =========================
  const allowedOrigins = [
    // Production
    'https://demo-pos.ahnafrafid.my.id',
    'https://web-pos-eta-sepia.vercel.app',

    // Development
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: unknown, allow: boolean) => void,
    ) => {
      // Allow requests without Origin:
      // Postman, curl, mobile apps, server-to-server, etc.
      if (!origin) {
        return callback(null, true);
      }

      // =========================
      // ALLOWED DOMAIN
      // =========================
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // =========================
      // LOCALHOST
      // =========================
      const isLocalhost =
        /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);

      if (isLocalhost) {
        return callback(null, true);
      }

      // =========================
      // LOCAL NETWORK
      // =========================
      const isLocalNetwork =
        /^https?:\/\/(?:(?:192\.168|10)\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+)(?::\d+)?$/.test(
          origin,
        );

      if (isLocalNetwork) {
        return callback(null, true);
      }

      // =========================
      // BLOCK
      // =========================
      console.log('CORS blocked:', origin);

      return callback(
        new Error(`Origin ${origin} tidak diizinkan oleh CORS`),
        false,
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Cookie',
    ],

    exposedHeaders: ['Set-Cookie'],
  });

  // =========================
  // SWAGGER
  // =========================
  const config = new DocumentBuilder()
    .setTitle('POS API')
    .setDescription('API untuk sistem POS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  // =========================
  // START SERVER
  // =========================
  await app.listen(process.env.PORT ?? 3000);

  console.log('SERVER SUDAH JALAN');
}

bootstrap();
