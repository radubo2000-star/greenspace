// ============================================
// PAGE VIEWS STORE
// ============================================
// Stores all page views in a single JSON file instead of one file per view.
// Uses an append-friendly approach: reads the array, pushes, writes back.
// Much more efficient for filesystem and querying than thousands of tiny files.

const fs = require('fs');
const path = require('path');
const { dataFolder } = require('./folders');
const logger = require('./logger');
const firebaseStore = require('./firebase-store');

const analyticsFolder = path.join(dataFolder, 'analytics');
const pageViewsFile = path.join(analyticsFolder, 'page-views.json');

// Simple write queue to prevent concurrent read-modify-write on the JSON file.
// Each queued write waits for the previous one to finish before executing.
let _writePromise = Promise.resolve();

/**
 * Ensure the analytics folder and file exist
 */
function ensureStore() {
  if (!fs.existsSync(analyticsFolder)) {
    fs.mkdirSync(analyticsFolder, { recursive: true });
  }
  if (!fs.existsSync(pageViewsFile)) {
    fs.writeFileSync(pageViewsFile, '[]', 'utf8');
  }
}

/**
 * Read all page views from the store.
 * Uses Firebase Realtime DB if available, otherwise falls back to file.
 * @returns {Promise<Array<Object>>} Array of page view records
 */
async function readPageViews() {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      return await firebaseStore.readPageViews();
    } catch (error) {
      logger.warn('Firebase readPageViews failed, falling back to file:', error.message);
    }
  }

  // Filesystem fallback
  ensureStore();
  try {
    const content = fs.readFileSync(pageViewsFile, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    logger.error('Error reading page views store:', error);
    return [];
  }
}

/**
 * Append a single page view to the store.
 * Uses Firebase Realtime DB if available, otherwise falls back to file.
 * File writes are serialised through a simple promise queue so that
 * concurrent requests don't cause lost writes via read-modify-write races.
 * @param {Object} pageView - The page view data to append
 * @returns {Promise<void>}
 */
async function appendPageView(pageView) {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      await firebaseStore.appendPageView(pageView);
      return;
    } catch (error) {
      logger.warn('Firebase appendPageView failed, falling back to file:', error.message);
    }
  }

  // Filesystem fallback — enqueue write to avoid concurrent race conditions
  _writePromise = _writePromise.then(() => {
    ensureStore();
    try {
      const content = fs.readFileSync(pageViewsFile, 'utf8');
      const views = JSON.parse(content);
      views.push(pageView);
      fs.writeFileSync(pageViewsFile, JSON.stringify(views, null, 2), 'utf8');
    } catch (error) {
      logger.error('Error appending page view:', error);
      throw error;
    }
  });

  return _writePromise;
}

/**
 * Migrate existing per-file page views into the single JSON store.
 * Reads all .json files from the old page-views folder, merges them
 * into the new single-file store, then removes the old individual files.
 * Safe to call multiple times — skips if no old folder exists.
 */
async function migrateOldPageViews() {
  const oldFolder = path.join(analyticsFolder, 'page-views');
  if (!fs.existsSync(oldFolder)) {
    return;
  }

  try {
    const files = fs.readdirSync(oldFolder).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      return;
    }

    logger.info(`Migrating ${files.length} old page view files to single store...`);

    const oldViews = files.map(file => {
      const filePath = path.join(oldFolder, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    });

    // Merge with any existing views in the new store
    // readPageViews() is async (may hit Firebase), so we must await it.
    // However, during migration the file fallback is the only reliable
    // source, so read directly from the local JSON file instead.
    ensureStore();
    let existingViews = [];
    try {
      const content = fs.readFileSync(pageViewsFile, 'utf8');
      existingViews = JSON.parse(content);
    } catch (_ignored) {
      // Empty or invalid file — start fresh
    }
    const merged = existingViews.concat(oldViews);
    merged.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    ensureStore();
    fs.writeFileSync(pageViewsFile, JSON.stringify(merged, null, 2), 'utf8');

    // Remove old individual files
    files.forEach(file => {
      fs.unlinkSync(path.join(oldFolder, file));
    });

    // Remove old folder if empty
    const remaining = fs.readdirSync(oldFolder);
    if (remaining.length === 0) {
      fs.rmdirSync(oldFolder);
    }

    logger.info(`Migration complete: ${oldViews.length} page views migrated.`);
  } catch (error) {
    logger.error('Error migrating old page views:', error);
  }
}

/**
 * Clear all page views from the store.
 * Uses Firebase if available, otherwise clears the local JSON file.
 * @returns {Promise<void>}
 */
async function clearPageViews() {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      await firebaseStore.clearPageViews();
      return;
    } catch (error) {
      logger.warn('Firebase clearPageViews failed, falling back to file:', error.message);
    }
  }

  // Filesystem fallback — enqueue write to avoid concurrent race conditions
  _writePromise = _writePromise.then(() => {
    ensureStore();
    try {
      fs.writeFileSync(pageViewsFile, '[]', 'utf8');
    } catch (error) {
      logger.error('Error clearing page views:', error);
      throw error;
    }
  });

  return _writePromise;
}

module.exports = {
  readPageViews,
  appendPageView,
  clearPageViews,
  migrateOldPageViews,
};
