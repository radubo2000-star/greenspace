// ============================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ============================================
// Protects admin and file management routes.
// Validates Firebase ID tokens via Firebase Admin SDK.

const admin = require('../config/firebase-admin');
const { hasCredentials } = require('../config/firebase-admin');
const logger = require('../utils/logger');

/**
 * Admin authentication middleware.
 * Verifies the Firebase ID token in the Authorization header.
 *
 * When Firebase Admin SDK has valid service-account credentials the token
 * is fully verified (signature, expiry, audience).  When no credentials
 * were loaded at startup the middleware falls back to a presence-only
 * check so the app still works during local development.
 */
async function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please provide a valid authorization token.',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }

  // If no service-account credentials were configured, accept any
  // well-formed Bearer token (presence-only check).
  if (!hasCredentials()) {
    return next();
  }

  // Full token verification via Firebase Admin SDK
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (err) {
    logger.error('adminAuth: token verification failed:', err.code || err.message);
    return res.status(401).json({
      success: false,
      error: 'Authentication token is invalid or expired.',
    });
  }
}

module.exports = adminAuth;
