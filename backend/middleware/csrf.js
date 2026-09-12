// ============================================
// CSRF PROTECTION MIDDLEWARE
// ============================================
// Uses csrf-csrf (double-submit cookie pattern) for stateless CSRF protection.
// Compatible with cross-origin API setups where frontend and backend
// run on different origins.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { doubleCsrf } = require('csrf-csrf');
const config = require('../config');
const { dataFolder } = require('../utils/folders');

const isProduction = config.isProduction();

const CSRF_SECRET_FILE = path.join(dataFolder, 'csrf-secret');

/**
 * Resolve the CSRF secret.
 * Preference order:
 *   1. CSRF_SECRET env variable (recommended, set it in production)
 *   2. A persisted random secret in `data/csrf-secret` (auto-generated on
 *      first boot). Persisting keeps the token stable across restarts and
 *      redeploys, and works out-of-the-box on cPanel/Passenger without any
 *      extra configuration.
 */
function resolveCsrfSecret() {
  if (process.env.CSRF_SECRET) return process.env.CSRF_SECRET;

  try {
    if (fs.existsSync(CSRF_SECRET_FILE)) {
      const stored = fs.readFileSync(CSRF_SECRET_FILE, 'utf8').trim();
      if (stored) return stored;
    }
  } catch (err) {
    console.warn('Could not read CSRF secret file:', err.message);
  }

  const generated = crypto.randomBytes(32).toString('hex');
  try {
    fs.mkdirSync(path.dirname(CSRF_SECRET_FILE), { recursive: true });
    fs.writeFileSync(CSRF_SECRET_FILE, generated, { mode: 0o600 });
    if (isProduction) {
      console.log('🔐 Generated and persisted a new CSRF secret at', CSRF_SECRET_FILE);
    }
  } catch (err) {
    console.warn('Could not persist CSRF secret file:', err.message);
  }
  return generated;
}

const csrfSecret = resolveCsrfSecret();

const {
  generateCsrfToken,
  doubleCsrfProtection
} = doubleCsrf({
  getSecret: () => csrfSecret,
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
