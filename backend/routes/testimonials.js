// ============================================
// HOME-PAGE TESTIMONIALS ROUTES (MySQL)
// ============================================
// Replaces the frontend's direct `testimonials` collection (the
// testimonials carousel on the first page). Public GET returns the
// active ones; admin CRUD manages all of them.

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const store = require('../utils/mysql-store');
const { validateFieldLengths } = require('../utils/sanitize');
const logger = require('../utils/logger');

function requireValidBody(req, res) {
  const error = validateFieldLengths(req.body);
  if (error) {
    res.status(400).json({ success: false, error });
    return false;
  }
  return true;
}

router.get('/', async (_req, res) => {
  try {
    const testimonials = await store.getActiveHomepageTestimonials();
    res.json({ success: true, testimonials });
  } catch (error) {
    logger.error('Error reading homepage testimonials:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea testimonialelor.' });
  }
});

// Admin (all, including inactive)
router.get('/all', adminAuth, async (_req, res) => {
  try {
    const testimonials = await store.getAllHomepageTestimonials();
    res.json({ success: true, testimonials });
  } catch (error) {
    logger.error('Error reading all homepage testimonials:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea testimonialelor.' });
  }
});

router.post('/', adminAuth, async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    if (!req.body?.name) {
      return res.status(400).json({ success: false, error: 'Numele este obligatoriu.' });
    }
    const { id } = await store.createHomepageTestimonial(req.body);
    res.status(201).json({ success: true, id, message: 'Testimonial adăugat cu succes!' });
  } catch (error) {
    logger.error('Error creating homepage testimonial:', error);
    res.status(500).json({ success: false, error: 'Eroare la salvarea testimonialului.' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    await store.updateHomepageTestimonial(req.params.id, req.body);
    res.json({ success: true, message: 'Testimonial actualizat cu succes!' });
  } catch (error) {
    logger.error('Error updating homepage testimonial:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea testimonialului.' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await store.deleteHomepageTestimonial(req.params.id);
    res.json({ success: true, message: 'Testimonial șters cu succes!' });
  } catch (error) {
    logger.error('Error deleting homepage testimonial:', error);
    res.status(500).json({ success: false, error: 'Eroare la ștergerea testimonialului.' });
  }
});

module.exports = router;