import { initMongoDb } from '../src/dB/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDb();
  startServer();
};

bootstrap();
