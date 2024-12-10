//server
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import waterRouter from './routers/waterRoute.js';
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const PORT = Number(env('PORT', '8080'));

export const setupServer = () => {
  const app = express();
  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
      limit: '100kb',
    }),
  );
  // app.use(
  //   cors({
  //     origin: 'https://frontend-inter-mafia.vercel.app',
  //     // origin: 'http://localhost:5173', // URL вашого фронтенда
  //     credentials: true,
  //   }),
  // );
  const allowedOrigins = [
    'http://localhost', // Для будь-якого порту на localhost
    'https://frontend-inter-mafia.vercel.app', // Ваш розгорнутий фронтенд
    undefined, // Для Postman (відсутній `origin`)
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Дозволити запити без `origin` (наприклад, з Postman)
        if (
          !origin ||
          allowedOrigins.some((allowed) => origin?.startsWith(allowed))
        ) {
          callback(null, true); // Дозволити запит
        } else {
          callback(new Error('Not allowed by CORS')); // Заборонити запит
        }
      },
      credentials: true, // Дозволити передачу куків
    }),
  );
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/api/water', waterRouter);
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });
  // app.use((req, res, next) => {
  //   console.log('Received request to refresh session', {
  //     cookies: req.cookies,
  //     body: req.body,
  //   });
  //   next();
  // });
  app.use(router);

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};
