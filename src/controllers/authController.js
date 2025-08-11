import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import nodemailer from "nodemailer";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetPasswordToken,
  verifyResetPasswordToken,
} from "../utils/tokenUtils.js";

const SALT_ROUNDS = 10;

// --- Регистрация ---
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw createHttpError(400, "Missing required fields: name, email, or password");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createHttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: { userId: newUser._id, email: newUser.email },
    });
  } catch (error) {
    next(error);
  }
};

// --- Логин ---
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(401, "Email or password is wrong");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Email or password is wrong");
    }
    const accessToken = generateAccessToken({ _id: user._id, email: user.email });
    const refreshToken = generateRefreshToken({ _id: user._id, email: user.email });

    await Session.create({ userId: user._id, refreshToken });

    res.status(200).json({
      status: 200,
      message: "Login successful",
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// --- Refresh токен ---
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createHttpError(401, "Refresh token missing");
    }
    const payload = verifyRefreshToken(refreshToken);
    const session = await Session.findOne({ userId: payload._id, refreshToken });
    if (!session) {
      throw createHttpError(401, "Invalid refresh token");
    }
    const accessToken = generateAccessToken({ _id: payload._id, email: payload.email });
    const newRefreshToken = generateRefreshToken({ _id: payload._id, email: payload.email });

    session.refreshToken = newRefreshToken;
    await session.save();

    res.status(200).json({
      status: 200,
      message: "Token refreshed",
      data: { accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
};

// --- Logout ---
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createHttpError(401, "Refresh token missing");
    }
    await Session.deleteOne({ refreshToken });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// --- Отправка письма для сброса пароля ---
export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const token = generateResetPasswordToken({ email: user.email });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: "Reset Your Password",
      html: `<p>Click the link below to reset your password. The link is valid for 5 minutes:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    await transporter.sendMail(mailOptions).catch((error) => {
      throw createHttpError(500, "Failed to send the email, please try again later.");
    });

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// --- Сброс пароля ---
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = verifyResetPasswordToken(token);
    } catch {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    if (!payload.email) {
      throw createHttpError(401, "Invalid token payload.");
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: "Password has been successfully reset.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};