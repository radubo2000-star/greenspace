// ============================================
// RATE LIMITING MIDDLEWARE
// ============================================
// Exported rate limiters for use in specific routes

const rateLimit = require('express-rate-limit');

// Stricter rate limit for form submissions
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 form submissions per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many submissions, please try again later.' }
});

// Rate limit for file uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 uploads per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many uploads, please try again later.' }
});

// Rate limit for auth endpoints (signup, logout, verify, reset)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 auth requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' }
});

// Stricter rate limit for login (brute-force protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many attempts, please try again later.' }
});

// Rate limit for password reset emails (anti-spam)
const resetEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5, // 5 reset emails per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many reset requests, please try again later.' }
});

module.exports = { formLimiter, uploadLimiter, authLimiter, loginLimiter, resetEmailLimiter };
