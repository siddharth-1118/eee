const nodemailer = require('nodemailer');

const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER || 'srmeeelibraray@gmail.com',
    pass: process.env.SMTP_PASS || 'jzpvoyjarrtrpbeb'
  }
};

const transporter = nodemailer.createTransport(SMTP_CONFIG);

module.exports = {
  SMTP_CONFIG,
  transporter
};
