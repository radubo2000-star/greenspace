// ============================================
// CSRF PROTECTION MIDDLEWARE
// ============================================
// Uses csrf-csrf (double-submit cookie pattern) for stateless CSRF protection.
// Compatible with cross-origin API setups where frontend and backend
// run on different origins.

const { doubleCsrf } = require('csrf-csrf');
const config = require('../config');

const isProduction = config.isProduction();

// Validate CSRF_SECRET is set in production
if (isProduction && !process.env.CSRF_SECRET) {
  throw new Error(
    'CSRF_SECRET environment variable is required in production. ' +
    'Set a strong, random secret before starting the server.'
  );
}

const {
  generateCsrfToken,
  doubleCsrfProtection
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'greenspace-csrf-secret-change-in-production',
  getSessionIdentifier: (req) => req.ip || 'anonymous',
  cookieName: isProduction ? '__Host-greenspace.x-csrf-token' : 'greenspace.x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/',
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
});

/**
 * Middleware to generate and return a CSRF token via GET /csrf-token.
 * The frontend should call this endpoint on load and include the token
 * in subsequent POST/PUT/DELETE requests as the x-csrf-token header.
 */
function csrfTokenRoute(req, res) {
  const token = generateCsrfToken(req, res);
  res.json({ csrfToken: token });
}

module.exports = {
  doubleCsrfProtection,
  csrfTokenRoute,
};
