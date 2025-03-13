import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import { pinoHttp } from 'pino-http';
import { UPLOAD_DIR } from './constants/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';

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
  app.use(
    cors({
      origin: 'https://h2-o-flow-team4.vercel.app',
      credentials: true,
    }),
  );

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
