// =============================
import nodemailer from "nodemailer";
import createHttpError from "http-errors";

if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM) {
  throw new Error("SMTP configuration is missing in .env");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true для 465, false для 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Проверка подключения
transporter.verify()
  .then(() => console.log("SMTP connection successful"))
  .catch(err => console.error("SMTP connection error:", err));

export async function sendMail({ from, to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: from || process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (e) {
    console.error("sendMail error:", e);
    throw createHttpError(500, "Failed to send the email, please try again later.");
  }
}
