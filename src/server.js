// FILE: src/server.js
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { initMongoConnection } from "./db/initMongoConnection.js";

dotenv.config();

const app = express();

// ================== Middlewares ==================
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================== Swagger ==================
const swaggerDocument = JSON.parse(fs.readFileSync("./docs/swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ================== Routes ==================
app.use("/contacts", contactsRouter);
app.use("/auth", authRouter);

// ================== 404 handler ==================
app.use((req, res, next) => next(createError(404, "Route not found")));

// ================== Error handler ==================
app.use((err, req, res, next) => {
  console.error("Error handler:", err.message);
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || "Internal Server Error",
  });
});

// ================== Start server ==================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
});

// ================== Mongo connection ==================
initMongoConnection()
  .then(() => console.log("✅ Mongo connection successfully established!"))
  .catch((err) => console.error("❌ Mongo connection failed:", err.message));

export default app;
