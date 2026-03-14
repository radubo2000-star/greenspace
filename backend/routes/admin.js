// ============================================
// ADMIN ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const { loadAllData, computeStatistics } = require('../utils/statistics-service');
const logger = require('../utils/logger');

/**
 * Get all admin data
 */
router.get('/data', async (req, res) => {
  try {
    const data = await loadAllData();

    logger.info('📊 Admin data requested:', {
      contacts: data.contacts.length,
      volunteers: data.volunteers.length,
      members: data.members.length,
      partnerships: data.partnerships.length,
      donations: data.donations.length,
    });

    res.json(data);
  } catch (error) {
    logger.error('Error reading admin data:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la citirea datelor.'
    });
  }
});

/**
 * Get admin statistics (uses dedicated service with 60s TTL cache)
 */
router.get('/statistics', async (req, res) => {
  try {
    logger.info('📊 Statistics endpoint called');

    const statistics = await computeStatistics();

    res.json({
      success: true,
      statistics
    });
  } catch (error) {
    logger.error('❌ Error calculating statistics:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la calcularea statisticilor.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
