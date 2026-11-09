import nodemailer from 'nodemailer';

const resendApiKey = process.env.RESEND_API_KEY;
const isResend = Boolean(resendApiKey || process.env.SMTP_HOST?.includes('resend'));

const host = isResend ? 'smtp.resend.com' : (process.env.SMTP_HOST || 'smtp.gmail.com');
const port = parseInt(process.env.SMTP_PORT || '465', 10);

export const SMTP_CONFIG = {
  host,
  port,
  secure: port === 465, // SSL for 465, TLS for 587
  auth: {
    user: isResend ? 'resend' : (process.env.SMTP_USER || 'srmeeelibraray@gmail.com'),
    pass: resendApiKey || process.env.SMTP_PASS || 'jzpvoyjarrtrpbeb'
  }
};

export const transporter = nodemailer.createTransport({
  ...SMTP_CONFIG,
  tls: {
    rejectUnauthorized: false
  }
});
