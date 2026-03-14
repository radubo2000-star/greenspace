// ============================================
// HEALTH & STATUS ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const config = require('../config');
const { uploadFolder } = require('../utils/folders');
const logger = require('../utils/logger');

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  logger.debug('[GET /health] Health check endpoint hit');
  
  const response = { 
    status: 'ok', 
    message: 'Green Space Backend Server is running',
    environment: config.nodeEnv,
    apiPrefix: config.useApiPrefix ? config.apiPrefix : 'none',
    timestamp: new Date().toISOString()
  };

  // Only include internal paths in development
  if (config.isDevelopment()) {
    response.uploadFolder = uploadFolder;
  }

  res.json(response);
});

module.exports = router;
