//server
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import waterRouter from './routers/waterRoute.js';

export const setupServer = () => {
  const app = express();
  const PORT = 8080;
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.use(cors());
  app.use(express.json());

  app.use('/api/water', waterRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
};
