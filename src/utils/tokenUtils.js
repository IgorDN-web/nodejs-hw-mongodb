import dotenv from "dotenv";
dotenv.config(); // обязательно в начале

import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET || !JWT_SECRET) {
  throw new Error("Missing JWT secret(s) in environment variables");
}

/**
 * Генерирует access токен на 15 минут
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

/**
 * Генерирует refresh токен на 30 дней
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};

/**
 * Верифицирует access токен
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

/**
 * Верифицирует refresh токен
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

/**
 * Генерирует токен для сброса пароля на 5 минут
 */
export const generateResetPasswordToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5m" });
};

/**
 * Верифицирует токен сброса пароля
 */
export const verifyResetPasswordToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
