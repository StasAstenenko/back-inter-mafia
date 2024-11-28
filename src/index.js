// запуск сервера, подключение к бд

import { initMongoConnection } from './db/initMongoDB.js';
import { setupServer } from './server.js';

const connectDB = async () => {
  await initMongoConnection();
  setupServer();
};

connectDB();
