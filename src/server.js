import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import { initMongoConnection } from "./db/initMongoConnection.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Добавляем обработчик для корневого маршрута
app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to the Contacts API",
  });
});

// Роуты
app.use("/contacts", contactsRouter);
app.use("/auth", authRouter);

// Обработка несуществующих маршрутов
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status,
    message: err.message,
  });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
initMongoConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });