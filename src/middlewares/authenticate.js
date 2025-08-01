import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "Not authorized");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Проверяем, что accessToken активен и существует в базе сессий
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, "Session not found. Please log in again.");
    }

    // Добавляем данные пользователя в объект запроса для дальнейшего использования
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(createHttpError(401, "Access token expired"));
    } else {
      next(createHttpError(401, "Not authorized"));
    }
  }
};
