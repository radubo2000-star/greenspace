// ============================================
// FORM SUBMISSION ROUTES
// ============================================
// Handles contact, volunteer, member, partnership, and donation forms

const express = require('express');
const router = express.Router();
const { formLimiter } = require('../middleware/rateLimiter');
const { validateFieldLengths } = require('../utils/sanitize');

// Reject requests where any field exceeds its allowed length
router.use((req, res, next) => {
  const error = validateFieldLengths(req.body);
  if (error) {
    return res.status(400).json({ success: false, error });
  }
  next();
});

// Import form handlers
const contactHandler = require('./forms/contact');
const volunteerHandler = require('./forms/volunteer');
const memberHandler = require('./forms/member');
const partnershipHandler = require('./forms/partnership');
const donationHandler = require('./forms/donation');

// Mount form handlers (formLimiter applied per-route so it doesn't affect other endpoints)
router.post('/contact', formLimiter, contactHandler);
router.post('/volunteer', formLimiter, volunteerHandler);
router.post('/member', formLimiter, memberHandler);
router.post('/partnership', formLimiter, partnershipHandler);
router.post('/donation', formLimiter, donationHandler);

module.exports = router;
