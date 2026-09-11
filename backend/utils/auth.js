// ============================================
// AUTH UTILITIES
// ============================================
// Password hashing, session cookies, tokens and helpers shared by
// the auth routes and the adminAuth middleware.

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const config = require('../config');
const db = require('../config/database');
const logger = require('./logger');

const SESSION_COOKIE_NAME = 'greenspace_session';
const SESSION_COOKIE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

// ============================================
// PASSWORD HASHING
// ============================================

const BCRYPT_ROUNDS = 12;

/**
 * Hash a plaintext password with bcrypt.
 * @param {string} password
 * @returns {Promise<string>}
 */
function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
function verifyPassword(password, hash) {
  if (!password || !hash) return Promise.resolve(false);
  return bcrypt.compare(password, hash);
}

// ============================================
// SESSION TOKENS
// ============================================

/**
 * Generate a random 256-bit session token (base64url, ~43 chars).
 * @returns {string}
 */
function generateSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Cookie options for the session cookie.
 * HttpOnly + Secure (prod) + SameSite Lax, scoped to the API path.
 * @param {boolean} [isProduction]
 * @returns {import('express').CookieOptions}
 */
function sessionCookieOptions(isProduction = config.isProduction()) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: isProduction && config.useApiPrefix ? config.apiPrefix : '/',
    maxAge: SESSION_COOKIE_TTL_MS,
  };
}

/**
 * Create a session row for a user and remember its id on the response.
 * @param {import('mysql2/promise').PoolConnection} conn - Transaction connection
 * @param {object} res - Express response
 * @param {number|string} userId - The owning user id
 * @returns {Promise<void>}
 */
async function createSession(conn, res, userId) {
  const rawToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_COOKIE_TTL_MS);

  await conn.query(
    `INSERT INTO sessions (user_id, session_token_hash, expires_at, created_at)
     VALUES (?, ?, ?, NOW())`,
    [userId, hashToken(rawToken), expiresAt]
  );

  // The raw token is only ever sent to the browser — never persisted.
 res.cookie(SESSION_COOKIE_NAME, rawToken, sessionCookieOptions());
}

/**
 * Resolve the current user from the session cookie.
 *
 * Loads the session row and joins the user. The `sessions` view
 * (see sql/schema.sql) pivots out to a user even when the token
 * was issued before the view was created (fallback join).
 *
 * @param {import('express').Request} req
 * @returns {Promise<{id:number,email:string,emailVerified:boolean}|null>} User or null
 */
async function getCurrentUser(req) {
  const rawToken = req.cookies?.[SESSION_COOKIE_NAME];
  if (!rawToken) return null;

  const tokenHash = hashToken(rawToken);
  const rows = await db.query(
    `SELECT u.id, u.email, u.email_verified
       FROM sessions s
       JOIN users u ON u.id = s.user_id
      WHERE s.session_token_hash = ? AND s.expires_at > NOW()`,
    [tokenHash]
  );

  if (!rows.length) return null;

  return {
    id: rows[0].id,
    email: rows[0].email,
    emailVerified: !!rows[0].email_verified,
  };
}

/**
 * Destroy the session (delete row and clear cookie).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
async function destroySession(req, res) {
  const rawToken = req.cookies?.[SESSION_COOKIE_NAME];

  if (rawToken) {
    await db.query(
      'DELETE FROM sessions WHERE session_token_hash = ?',
      [hashToken(rawToken)]
    );
  }
  res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions());
}

// ============================================
// VERIFICATION / RESET TOKENS
// ============================================

/**
 * Hash a one-time token before persistence (DB leaks never expose the raw token).
 * @param {string} token
 * @returns {string}
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a one-time token (email verification / password reset) and
 * return its hash for storage plus the raw token for the email link.
 * @returns {{raw: string, hash: string, expiresAt: Date}
 */
function generateOneTimeToken() {
  const raw = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
  return { raw, hash: hashToken(raw), expiresAt };
}

/**
 * Serialize the user minus any sensitive fields.
 * @param {{id:number,email:string,emailVerified:boolean}} user
 * @returns {{id:number,email:string,emailVerified:boolean}}
 */
function serializeUser(user) {
  return {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
  };
}

module.exports = {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_TTL_MS,
  TOKEN_TTL_MS,
  hashPassword,
  verifyPassword,
  generateSessionToken,
  sessionCookieOptions,
  createSession,
  getCurrentUser,
  destroySession,
  hashToken,
  generateOneTimeToken,
  serializeUser,
};