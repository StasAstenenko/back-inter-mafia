// запуск сервера, подключение к бд

import { initMongoDB } from './db/initMongoDB.js';
import { setupServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB();
  setupServer();
};

void bootstrap();
