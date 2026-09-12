// ============================================
// PAGE VIEWS STORE (MySQL)
// ============================================
// Stores page views in the `page_views` table (see sql/schema.sql).
// Stores page views in MySQL (page_views table).

const db = require('../config/database');
const logger = require('./logger');

/**
 * Convert a DATETIME(3) column string to an ISO timestamp (ms precision).
 * @param {string} value - 'YYYY-MM-DD HH:MM:SS.mmm'
 * @returns {string}
 */
function toIsoString(value) {
  if (!value) return new Date().toISOString();
  const str = String(value).replace(' ', 'T');
  return new Date(str.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(str) ? str : `${str}Z`).toISOString();
}

/**
 * Read all page views from the store, oldest first.
 * @returns {Promise<Array<Object>>} Array of page view records
 */
async function readPageViews() {
  try {
    const rows = await db.query('SELECT id, path, title, referrer, user_agent, created_at FROM page_views ORDER BY created_at ASC');
    return rows.map(row => ({
      id: String(row.id),
      path: row.path,
      title: row.title,
      referrer: row.referrer,
      userAgent: row.user_agent,
      timestamp: toIsoString(row.created_at),
    }));
  } catch (error) {
    logger.error('Error reading page views:', error.message);
    return [];
  }
}

/**
 * Append a single page view to the store.
 * @param {Object} pageView - { path, title, timestamp, referrer, userAgent }
 * @returns {Promise<void>}
 */
async function appendPageView(pageView) {
  await db.query(
    `INSERT INTO page_views (path, title, referrer, user_agent)
     VALUES (?, ?, ?, ?)`,
    [
      pageView.path,
      pageView.title ?? null,
      pageView.referrer ?? null,
      pageView.userAgent ?? null,
    ]
  );
}

/**
 * Legacy migration – previously merged old per-file page views into a
 * single JSON store. All data now lives in MySQL, so nothing to do.
 */
async function migrateOldPageViews() {
  // No-op: data migration to MySQL happens via a manual SQL import.
}

/**
 * Clear all page views from the store.
 * @returns {Promise<void>}
 */
async function clearPageViews() {
  await db.query('TRUNCATE TABLE page_views');
}

module.exports = {
  readPageViews,
  appendPageView,
  clearPageViews,
  migrateOldPageViews,
};