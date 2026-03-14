// ============================================
// NODEMAILER CONFIGURATION
// ============================================

const nodemailer = require('nodemailer');
const config = require('./index');

const transporter = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  secure: config.email.smtp.secure,
  auth: {
    user: config.email.smtp.user,
    pass: config.email.smtp.pass,
  },
});

module.exports = transporter;
