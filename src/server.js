//server
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

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
  app.get('/', (req, res) => {
    res.json({ message: 'water' });
  });

  app.use('/api/water');
  app.use(errorHandler);
  app.listen(PORT, () => {
    console.log('Connect was successfully');
  });
};
