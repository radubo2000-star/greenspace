// ============================================
// AUTH ROUTES (MySQL sessions)
// ============================================
// /auth/signup, /auth/login, /auth/logout, /auth/me,
// /auth/verify-email, /auth/forgot-password, /auth/reset-password.

// Sessions are HTTP-only cookies backed by the MySQL `sessions` table so
// Passwords are hashed with bcrypt;
// verification/reset tokens are stored cryptographically hashed (SHA-256).

const express = require('express');
const router = express.Router();
const config = require('../config');
const db = require('../config/database');
const { getPool } = require('../config/database');
const { isValidEmail } = require('../utils/helpers');
const { renderEmail } = require('../utils/email-renderer');
const {
  hashPassword,
  verifyPassword,
  createSession,
  getCurrentUser,
  destroySession,
  hashToken,
  generateOneTimeToken,
} = require('../utils/auth');
const { authLimiter, loginLimiter, resetEmailLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

const PASSWORD_MIN_LENGTH = 6;

// ============================================
// HELPERS
// ============================================

/**
 * Base URL for frontend links (dev: use the request Origin so links
 * work regardless of the port the frontend runs on).
 */
function frontendBaseUrl(req) {
  if (config.isDevelopment() && req.headers.origin) {
    return req.headers.origin;
  }
  return config.frontendBaseUrl;
}

/**
 * Send the verification email if SMTP is configured (silently skips otherwise).
 */
async function sendVerificationEmail(req, userEmail, verificationTokenRaw) {
  if (!config.isEmailConfigured()) return;

  const transporter = require('../config/nodemailer');
  const url = `${frontendBaseUrl(req)}/verify-email?token=${encodeURIComponent(verificationTokenRaw)}`;
  await transporter.sendMail({
    from: config.email.fromEmail,
    to: userEmail,
    subject: 'Verifică-ți emailul - Asociația Green Space',
    html: renderEmail('verify-email', { verificationUrl: url }),
  });
}

/**
 * Send the password-reset email if SMTP is configured (silently skips otherwise).
 */
async function sendResetEmail(req, userEmail, resetTokenRaw) {
  if (!config.isEmailConfigured()) return;

  const transporter = require('../config/nodemailer');
  const url = `${frontendBaseUrl(req)}/reset-password?token=${encodeURIComponent(resetTokenRaw)}`;
  await transporter.sendMail({
    from: config.email.fromEmail,
    to: userEmail,
    subject: 'Resetare parolă - Asociația Green Space',
    html: renderEmail('reset-password', { resetUrl: url }),
  });
}

// ============================================
// SIGNUP
// ============================================
// Creates the user (unverified), starts a session,and e-mails a
// verification link when SMTP is configured.

router.post('/signup', authLimiter, async (req, res, next) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Emailul și parola sunt obligatorii' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Email invalid' });
    }
    if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ success: false, error: 'Parola trebuie să aibă cel puțin șase caractere' });
    }

    const passwordHash = await hashPassword(password);
    const { raw: verificationTokenRaw, hash: verificationTokenHash, expiresAt: verificationExpiresAt } = generateOneTimeToken();

    const conn = await getPool().getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(
        `INSERT INTO users (email, password_hash, email_verified, verification_token_hash, verification_expires_at)
         VALUES (?, ?, FALSE, ?, ?)`,
        [email.toLowerCase(), passwordHash, verificationTokenHash, verificationExpiresAt]
      );

      await createSession(conn, res, result.insertId);
      await conn.commit();

      const user = { id: result.insertId, email: email.toLowerCase(), emailVerified: false };

      try {
        await sendVerificationEmail(req, user.email, verificationTokenRaw);
      } catch (emailError) {
        logger.warn('Verification email failed:', emailError.message);
      }

      res.status(201).json({ success: true, user });
    } catch (error) {
      await conn.rollback();
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, error: 'Există deja un cont cu acest email' });
      }
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    next(error);
  }
});

// ============================================
// LOGIN
// ============================================

router.post('/login', loginLimiter, async (req, res, next) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Emailul și parola sunt obligatorii' });
    }

    const rows = await db.query(
      'SELECT id, email, password_hash, email_verified FROM users WHERE email = ?',
      [String(email).toLowerCase()]
    );

    if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) {
      return res.status(401).json({ success: false, error: 'Email sau parolă incorectă' });
    }

    const conn = await getPool().getConnection();
    try {
      await conn.beginTransaction();
      await createSession(conn, res, rows[0].id);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }

    const user = { id: rows[0].id, email: rows[0].email, emailVerified: !!rows[0].email_verified };
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ============================================
// LOGOUT
// ============================================

router.post('/logout', authLimiter, async (req, res, next) => {
  try {
    await destroySession(req, res);
    res.json({ success: true, message: 'Logged out' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// ME (session look-up)
// ============================================

router.get('/me', async (req, res, next) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ============================================
// VERIFY EMAIL
// ============================================

router.post('/verify-email', authLimiter, async (req, res, next) => {
  const { token } = req.body || {};

  try {
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token lipsă' });
    }

    const rows = await db.query(
      `SELECT id FROM users
        WHERE verification_token_hash = ? AND verification_expires_at > NOW()`,
      [hashToken(token)]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, error: 'Linkul de verificare este invalid sau a expirat' });
    }

    await db.query(
      `UPDATE users SET email_verified = TRUE, verification_token_hash = NULL, verification_expires_at = NULL WHERE id = ?`,
      [rows[0].id]
    );

    res.json({ success: true, message: 'Email verificat cu succes' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// FORGOT PASSWORD
// ============================================
// Always responds 200 (generic) to avoid leaking which emails exist.

// When SMTP is configured a reset link is e-mailed to the user.

router.post('/forgot-password', resetEmailLimiter, async (req, res, next) => {
  const { email } = req.body || {};

  try {
    const rows = email
      ? await db.query('SELECT id, email FROM users WHERE email = ?', [String(email).toLowerCase()])
      : [];

    if (rows.length) {
      const { raw: resetTokenRaw, hash: resetTokenHash, expiresAt: resetExpiresAt } = generateOneTimeToken();

      await db.query(
        `UPDATE users SET reset_token_hash = ?, reset_expires_at = ? WHERE id = ?`,
        [resetTokenHash, resetExpiresAt, rows[0].id]
      );

      try {
        await sendResetEmail(req, rows[0].email, resetTokenRaw);
      } catch (emailError) {
        logger.warn('Reset email failed:', emailError.message);
      }
    }

    res.json({ success: true, message: 'Dacă adresa de email există în sistem, vei primi un link de resetare.' });
  } catch (error) {
    next(error);
  }
});

// ============================================
// RESET PASSWORD
// ============================================

router.post('/reset-password', authLimiter, async (req, res, next) => {
  const { token, password } = req.body || {};

  try {
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token lipsă' });
    }
    if (!password || typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
      return res.status(400).json({ success: false, error: 'Parola trebuie să aibă cel puțin șase caractere' });
    }

    const rows = await db.query(
      `SELECT id FROM users
        WHERE reset_token_hash = ? AND reset_expires_at > NOW()`,
      [hashToken(token)]
    );

    if (!rows.length) {
      return res.status(400).json({ success: false, error: 'Linkul de resetare este invalid sau a expirat' });
    }

    const passwordHash = await hashPassword(password);
    const conn = await getPool().getConnection();

    try {
      await conn.beginTransaction();
      await conn.query(
        `UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_expires_at = NULL WHERE id = ?`,
        [passwordHash, rows[0].id]
      );
      // Invalidate all existing sessions after a password change.

      await conn.query('DELETE FROM sessions WHERE user_id = ?', [rows[0].id]);
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }

    res.json({ success: true, message: 'Parola a fost resetată. Te poți autentifica cu noua parolă.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
