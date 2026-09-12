// ============================================
// ANNUAL STATISTICS ROUTES (MySQL)
// ============================================
// Public GET
// powers the Hero + Statistics page; admin CRUD powers the admin page.

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const store = require('../utils/mysql-store');
const logger = require('../utils/logger');

router.get('/', async (_req, res) => {
  try {
    const statistics = await store.getAllStatistics();
    res.json({ success: true, statistics });
  } catch (error) {
    logger.error('Error reading annual statistics:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea statisticilor.' });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    if (!req.body?.year) {
      return res.status(400).json({ success: false, error: 'Anul este obligatoriu.' });
    }
    const { id } = await store.createStatistics(req.body);
    res.status(201).json({ success: true, id, message: 'Statistici adăugate cu succes!' });
  } catch (error) {
    logger.error('Error creating annual statistics:', error);
    if (error.code === 'ER_DUP_ENTRY' || (error.message && error.message.includes('Duplicate'))) {
      return res.status(409).json({ success: false, error: 'Există deja statistici pentru acest an.' });
    }
    res.status(500).json({ success: false, error: 'Eroare la salvarea statisticilor.' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    await store.updateStatistics(req.params.id, req.body);
    res.json({ success: true, message: 'Statistici actualizate cu succes!' });
  } catch (error) {
    logger.error('Error updating annual statistics:', error);
    if (error.code === 'ER_DUP_ENTRY' || (error.message && error.message.includes('Duplicate'))) {
      return res.status(409).json({ success: false, error: 'Există deja statistici pentru acest an.' });
    }
    res.status(500).json({ success: false, error: 'Eroare la actualizarea statisticilor.' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await store.deleteStatistics(req.params.id);
    res.json({ success: true, message: 'Statistici șterse cu succes!' });
  } catch (error) {
    logger.error('Error deleting annual statistics:', error);
    res.status(500).json({ success: false, error: 'Eroare la ștergerea statisticilor.' });
  }
});

module.exports = router;