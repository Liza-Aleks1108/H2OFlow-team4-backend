// src/constants/index.js

import path from 'node:path';

export const FIFTEEN_MINUTES = 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;

// у файлі src/constants/index.js константу SWAGGER_PATH :
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
  JWT_SECRET: 'JWT_SECRET',
  APP_DOMAIN: 'APP_DOMAIN',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};

export const TEMP_DIR = path.join(process.cwd(), 'temp');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
