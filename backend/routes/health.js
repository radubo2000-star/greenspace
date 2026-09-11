// ============================================
// HEALTH & STATUS ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const config = require('../config');
const { uploadFolder } = require('../utils/folders');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  logger.debug('[GET /health] Health check endpoint hit');

  let mysql = false;
  try {
    mysql = await db.ping();
  } catch (err) {
    logger.warn('Health check: MySQL unreachable:', err.message);
  }

  const response = {
    status: 'ok',
    message: 'Green Space Backend Server is running',
    environment: config.nodeEnv,
    apiPrefix: config.useApiPrefix ? config.apiPrefix : 'none',
    mysql: mysql,
    timestamp: new Date().toISOString(),
  };

  // Only include internal paths in development
  if (config.isDevelopment()) {
    response.uploadFolder = uploadFolder;
  }

  res.json(response);
});

module.exports = router;
