// FILE: src/server.js (ensure JSON + multipart support)
// =============================
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


app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // multipart boundary parser helper
app.use(cookieParser());


app.use("/contacts", contactsRouter);
app.use("/auth", authRouter);


app.use((req, res, next) => {
next(createError(404, "Route not found"));
});


app.use((err, req, res, next) => {
res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
});


const PORT = process.env.PORT || 3000;
export const setupServer = () => app.listen(PORT, () => console.log(`Server running on ${PORT}`));


// Ensure DB is up and server starts (if you used index.js start wrapper, keep it)
initMongoConnection().then(() => setupServer());