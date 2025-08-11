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
  try {
    console.log('Attempting to send email to:', email); // Лог для отладки
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('SMTP Error:', error.message); // Лог ошибки
    throw new Error("Failed to send the email, please try again later.");
  }
}