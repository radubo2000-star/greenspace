// ============================================
// ROUTES INDEX
// ============================================
// Central router that combines all route modules

const express = require('express');
const healthRoutes = require('./health');
const uploadRoutes = require('./upload');
const formRoutes = require('./forms');
const adminRoutes = require('./admin');
const analyticsRoutes = require('./analytics');
const filesRoutes = require('./files');

// Import middleware
const adminAuth = require('../middleware/adminAuth');
const { sanitizeBody } = require('../utils/sanitize');
const { cacheHeaders, noCache } = require('../middleware/cacheHeaders');
const { doubleCsrfProtection, csrfTokenRoute } = require('../middleware/csrf');

const router = express.Router();

// Sanitize all incoming request bodies
router.use(sanitizeBody);

// Routes that do NOT need CSRF protection:
// - Health/analytics: public, read-heavy
// - Admin/files: already protected by Firebase adminAuth middleware
// - Uploads: already protected by Firebase adminAuth middleware
router.use('/', cacheHeaders(60), healthRoutes);
router.use('/analytics', cacheHeaders(120), analyticsRoutes);
router.use('/admin', noCache, adminAuth, adminRoutes);
router.use('/files', adminAuth, filesRoutes);
router.use('/', uploadRoutes);

// CSRF token endpoint — must be before CSRF protection middleware
router.get('/csrf-token', csrfTokenRoute);

// Apply CSRF protection to public form submissions.
// Only routes below this point require a CSRF token.
router.use(doubleCsrfProtection);

// NOTE: Rate limiters (formLimiter, uploadLimiter) are applied inside each
// route file to their specific endpoints — NOT here at the router level.
router.use('/', formRoutes);

module.exports = router;
