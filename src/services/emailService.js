import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendResetEmail(email, token) {
  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Password',
    html: `<p>Please reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  };
  await transporter.sendMail(mailOptions);
}
