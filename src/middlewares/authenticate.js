import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { User } from "../models/userModel.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw createHttpError(401, "Not authorized");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    // Проверяем, что accessToken существует в базе сессий
    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createHttpError(401, "Session not found. Please log in again.");
    }

    // Получаем пользователя из базы
    const user = await User.findById(payload._id);
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    // Добавляем пользователя в req
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      next(createHttpError(401, "Access token expired"));
    } else {
      next(createHttpError(401, error.message || "Not authorized"));
    }
  }
};