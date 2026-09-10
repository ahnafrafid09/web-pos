import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';

// Global instance to support cold starts - cache after first init
let _cachedExpressApp: Application | null = null;
let _initialized = false;

async function ensureInitialized() {
  if (_initialized) return;

  console.log('[Vercel] Initializing NestJS application...');
  const expressApp: Application = express();
  const adapter = new ExpressAdapter(expressApp);

  const nestApp: INestApplication = await NestFactory.create(
    AppModule,
    adapter,
    {
      logger: false,
      bodyParser: false,
    },
  );

  // Apply global pipes
  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('POS API')
    .setDescription('API untuk sistem POS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(nestApp, config);
  SwaggerModule.setup('docs', nestApp, document);

  // Initialize NestJS
  await nestApp.init();

  // After init, apply remaining middleware directly to Express app
  expressApp.use(cookieParser());

  // Enable CORS via middleware
  expressApp.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Accept, Cookie',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      res.writeHead(204).end();
      return;
    }

    next();
  });

  _cachedExpressApp = expressApp;
  _initialized = true;

  console.log('[Vercel] NestJS initialized successfully');
}

// Export default handler for Vercel Serverless
export default async function handler(req: Request, res: Response) {
  console.log('[Vercel Handler]', req.method, req.url);

  try {
    await ensureInitialized();

    if (!_cachedExpressApp) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Dispatch request through Express routing
    _cachedExpressApp.emit('request', req, res);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[Vercel] Error:', err.message, err.stack);

    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: 'Internal Server Error', details: err.message });
    }
  }
}
