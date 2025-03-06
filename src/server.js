import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pinoHttp } from 'pino-http';
import router from '../../H2OFlow-team4-backend/src/router/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT);

export const startServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  const logger = pinoHttp({
    transport: {
      target: 'pino-pretty',
    },
  });
  app.use(logger);

  app.use('/', router);
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });
  app.use(errorHandler);

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
