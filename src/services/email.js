// FILE: src/services/email.js
// =============================
import nodemailer from "nodemailer";
import createHttpError from "http-errors";


const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT || 587),
secure: false,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASSWORD,
},
});


export async function sendMail({ to, subject, html }) {
try {
await transporter.sendMail({
from: process.env.SMTP_FROM,
to,
subject,
html,
});
} catch (e) {
throw createHttpError(500, "Failed to send the email, please try again later.");
}
}