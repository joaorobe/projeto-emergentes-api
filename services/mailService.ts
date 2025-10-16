
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Sua Loja de Sapatos" <${process.env.MAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}