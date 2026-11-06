import nodemailer from 'nodemailer';

export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'srmeeelibraray@gmail.com',
    pass: process.env.SMTP_PASS || 'jzpvoyjarrtrpbeb'
  }
};

export const transporter = nodemailer.createTransport(SMTP_CONFIG);
