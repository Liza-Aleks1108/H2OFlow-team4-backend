import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { pinoHttp } from 'pino-http';
import { UPLOAD_DIR } from './constants/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import router from './routers/index.js';
import { getEnvVar } from './utils/getEnvVar.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT'));

export const startServer = async () => {
  const app = express();
  // const upload = multer();
  // app.use(upload.none());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    express.json({ type: ['application/json', 'application/vnd.api+json'] }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  // app.use(cors());
  // added 35 packages
  const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://h2-o-flow-team4.vercel.app',
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'DELETE'], //
  };
  app.use(cors(corsOptions));

  // app.use(
  //   cors({
  //     origin: '*',
  //   }),
  // );

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  const logger = pinoHttp({
    transport: {
      target: 'pino-pretty',
    },
  });
  app.use(logger);

  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "script-src 'self' 'nonce-abc123'",
    );
    next();
  });

  app.use(router);

  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
