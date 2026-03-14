// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

const multer = require('multer');
const config = require('../config');
const { isAllowedOrigin } = require('../config/cors');
const logger = require('../utils/logger');

function errorHandler(error, req, res, next) {
  // Ensure CORS headers are set even on errors
  const origin = req.headers.origin;
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, x-csrf-token');
  }

  // CSRF token errors — return 403 with clear message
  if (error.message === 'invalid csrf token') {
    return res.status(403).json({
      success: false,
      error: 'invalid csrf token'
    });
  }
  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: `File size too large. Maximum size is ${(config.maxFileSize / 1024 / 1024).toFixed(0)}MB.`
      });
    }
  }
  
  logger.error('❌ Server error:', error);
  
  res.status(500).json({
    success: false,
    error: config.isProduction() ? 'Internal server error' : (error.message || 'Internal server error')
  });
}

module.exports = errorHandler;
