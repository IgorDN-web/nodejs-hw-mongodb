// src/server.js
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { getEnvVar } from './utils/getEnvVar.js';

import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UPLOAD_DIR } from './constants/index.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

const startServer = async () => {
  // 1️⃣ Подключаемся к MongoDB
  await initMongoConnection();

  // 2️⃣ Создаем и настраиваем Express
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Основные роуты
  app.use(router);

  // Статика для загруженных файлов
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Обработчики ошибок
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer().catch(err => {
  console.error('Error starting server:', err);
});
