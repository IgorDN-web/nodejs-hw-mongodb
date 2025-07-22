import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import contactsRouter from "./routes/contactsRouter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(pino()); // логування запитів
app.use(express.json());

// Роут для контактів
app.use("/contacts", contactsRouter);

// Обробка неіснуючих маршрутів
app.use(notFoundHandler);

// Глобальна обробка помилок
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

initMongoConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
