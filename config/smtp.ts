import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.SMTP_PORT || (host.includes('brevo') || host.includes('sendinblue') ? '587' : '465'), 10);

export const SMTP_CONFIG = {
  host,
  port,
  secure: port === 465, // SSL for 465, TLS/STARTTLS for 587
  auth: {
    user: process.env.SMTP_USER || 'srmeeelibraray@gmail.com',
    pass: process.env.SMTP_PASS || 'jzpvoyjarrtrpbeb'
  }
};

export const transporter = nodemailer.createTransport({
  ...SMTP_CONFIG,
  // Brevo TLS compatibility settings
  tls: {
    rejectUnauthorized: false
  }
});
