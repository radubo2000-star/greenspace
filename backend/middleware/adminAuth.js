// ============================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ============================================
// Protects admin and file management routes.

// Validates the MySQL session cookie (set by POST /auth/login and
// /auth/signup) using the MySQL session cookie.

const { getCurrentUser } = require('../utils/auth');

/**
 * Admin authentication middleware. Verifies the session cookie and
 * attaches the current user to req.user. When no valid session
 * exists the request is rejected with 401.
 */
async function adminAuth(req, res, next) {
  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in to continue.',
      });
    }

    req.user = user;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token is invalid or expired.',
    });
  }
}

module.exports = adminAuth;
