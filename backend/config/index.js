// ============================================
// CONFIGURATION
// ============================================
// Central configuration file for all environment variables and settings

require('dotenv').config();

/**
 * @typedef {Object} SmtpConfig
 * @property {string} host
 * @property {number} port
 * @property {boolean} secure
 * @property {string|undefined} user
 * @property {string|undefined} pass
 */

/**
 * @typedef {Object} EmailConfig
 * @property {string} adminEmail
 * @property {string} fromEmail
 * @property {SmtpConfig} smtp
 */

/**
 * @typedef {Object} AppConfig
 * @property {number} port
 * @property {string} nodeEnv
 * @property {string} frontendUrl
 * @property {string} backendUrl
 * @property {string} apiPrefix
 * @property {boolean} useApiPrefix
 * @property {number} maxFileSize
 * @property {number} maxVideoSize
 * @property {string[]} allowedFileTypes
 * @property {EmailConfig} email
 * @property {string[]} allowedOrigins
 * @property {() => boolean} isProduction
 * @property {() => boolean} isDevelopment
 * @property {() => boolean} isEmailConfigured
 */

/** @type {AppConfig} */
const config = {
  // Server configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // URL configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  backendUrl: process.env.BACKEND_URL || (
    process.env.NODE_ENV === 'production' 
      ? 'https://api.asociatiagreenspace.ro' 
      : `http://localhost:${process.env.PORT || 5000}`
  ),
  
  // API configuration
  apiPrefix: process.env.API_PREFIX || '',
  useApiPrefix: (process.env.API_PREFIX || '') !== '',
  
  // File upload limits
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  maxVideoSize: parseInt(process.env.MAX_VIDEO_SIZE) || 100 * 1024 * 1024, // 100MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 
        'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/mpeg'
      ],
  
  // Email configuration
  email: {
    adminEmail: process.env.ADMIN_EMAIL || 'contact@asociatiagreenspace.ro',
    fromEmail: process.env.EMAIL_FROM || 'noreply@asociatiagreenspace.ro',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  
  // Allowed CORS origins (single source of truth)
  allowedOrigins: [
    'https://asociatiagreenspace.ro',
    'https://www.asociatiagreenspace.ro',
    'https://api.asociatiagreenspace.ro'
  ],

  // Helper methods
  isProduction() {
    return this.nodeEnv === 'production';
  },
  
  isDevelopment() {
    return this.nodeEnv === 'development';
  },
  
  isEmailConfigured() {
    return !!(this.email.smtp.user && this.email.smtp.pass);
  }
};

module.exports = config;
