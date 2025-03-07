import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import { pinoHttp } from 'pino-http';
import router from '../../H2OFlow-team4-backend/src/router/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT'));

export const startServer = async () => {
  const app = express();
  const upload = multer();
  app.use(upload.none());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    express.json({ type: ['application/json', 'application/vnd.api+json'] }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());

  const logger = pinoHttp({
    transport: {
      target: 'pino-pretty',
    },
  });
  app.use(logger);

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
