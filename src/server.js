// FILE: src/server.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

dotenv.config();
const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/contacts", contactsRouter);
app.use("/auth", authRouter);

// 404 handler
app.use((req, res, next) => next(createError(404, "Route not found")));

// Error handler
app.use((err, req, res, next) =>
  res.status(err.status || 500).json({ status: err.status || 500, message: err.message })
);

// Start server immediately so Render doesn't timeout
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB asynchronously
initMongoConnection()
  .then(() => console.log("Mongo connection successfully established!"))
  .catch(err => {
    console.error("Mongo connection failed:", err);
    // Optionally: shut down server if DB is critical
    // server.close();
  });
