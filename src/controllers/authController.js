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

// Регистрация, логин, refresh, logout - как у вас (пропущу тут чтобы не дублировать)

export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    // Генерация токена на 5 минут
    const token = generateResetPasswordToken({ email: user.email });

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    // Настройка транспорта nodemailer
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
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password. The link is valid for 5 minutes:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!info.accepted.length) {
      throw createHttpError(500, "Failed to send the email, please try again later.");
    }

    res.status(200).json({
      status: 200,
      message: "Reset password email has been successfully sent.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = verifyResetPasswordToken(token);
    } catch (err) {
      throw createHttpError(401, "Token is expired or invalid.");
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createHttpError(404, "User not found!");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPassword;
    await user.save();

    // Удаляем все сессии пользователя
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
