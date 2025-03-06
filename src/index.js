import { initMongoDb } from '../src/dB/initMongoDB.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { createDirIfNotExists } from './middlewares/createDirIfNotExists.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDb();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

bootstrap();
