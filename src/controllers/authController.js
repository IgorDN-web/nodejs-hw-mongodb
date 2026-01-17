import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils.js";

const SALT_ROUNDS = 10;

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw createHttpError(401, "Invalid email or password");
    }

    // Удаляем все старые сессии пользователя
    await Session.deleteMany({ userId: user._id });

    const payload = { _id: user._id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 дней

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      status: 200,
      message: "Successfully logged in an user!",
      data: { accessToken },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createHttpError(401, "Refresh token missing");
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      throw createHttpError(401, "Invalid refresh token");
    }

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createHttpError(401, "Session not found");
    }

    await Session.deleteOne({ refreshToken });

    const newAccessToken = generateAccessToken({ _id: payload._id, email: payload.email });
    const newRefreshToken = generateRefreshToken({ _id: payload._id, email: payload.email });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: payload._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      status: 200,
      message: "Successfully refreshed a session!",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    const authHeader = req.headers.authorization;
    let accessToken;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    }

    // Удаляем сессию по refreshToken и accessToken
    const filter = { $or: [] };
    if (refreshToken) filter.$or.push({ refreshToken });
    if (accessToken) filter.$or.push({ accessToken });

    if (filter.$or.length > 0) {
      await Session.deleteOne(filter);
    }

    res.clearCookie("refreshToken");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
