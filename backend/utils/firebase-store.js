// ============================================
// FIREBASE REALTIME DATABASE STORE
// ============================================
// Replaces file-based JSON storage with Firebase Realtime Database.
// Uses the existing Firebase Admin SDK configuration.
// Falls back to file-based storage if Firebase DB is not available.

const admin = require('../config/firebase-admin');
const logger = require('./logger');

let _db = null;

/**
 * Get the Firebase Realtime Database instance.
 * Returns null if the database URL was not configured.
 */
function getDatabase() {
  if (_db) return _db;

  try {
    _db = admin.database();
    return _db;
  } catch (error) {
    logger.warn('Firebase Realtime Database not available:', error.message);
    return null;
  }
}

/**
 * Check if Firebase Realtime Database is available
 * @returns {boolean}
 */
function isFirebaseDbAvailable() {
  return !!process.env.FIREBASE_DATABASE_URL && !!getDatabase();
}

// ============================================
// GENERIC CRUD OPERATIONS
// ============================================

/**
 * Save data to a Firebase collection (push a new record)
 * @param {string} collection - Collection path (e.g. 'forms/contacts')
 * @param {Object} data - Data to save
 * @returns {Promise<{id: string}>} The generated key
 */
async function saveRecord(collection, data) {
  const db = getDatabase();
  if (!db) {
    throw new Error('Firebase Database not available');
  }

  const ref = db.ref(collection);
  const newRef = ref.push();
  await newRef.set({
    ...data,
    _createdAt: new Date().toISOString(),
  });

  return { id: newRef.key };
}

/**
 * Read all records from a Firebase collection
 * @param {string} collection - Collection path
 * @returns {Promise<Array<Object>>} Array of records sorted by timestamp (newest first)
 */
async function readRecords(collection) {
  const db = getDatabase();
  if (!db) {
    throw new Error('Firebase Database not available');
  }

  const ref = db.ref(collection);
  const snapshot = await ref.once('value');
  const data = snapshot.val();

  if (!data) return [];

  const records = Object.entries(data).map(([id, value]) => ({
    _id: id,
    ...value,
  }));

  // Sort by timestamp descending (newest first)
  return records.sort((a, b) => {
    const dateA = new Date(a.timestamp || a._createdAt || 0);
    const dateB = new Date(b.timestamp || b._createdAt || 0);
    return dateB - dateA;
  });
}

/**
 * Append a page view record to the analytics collection
 * @param {Object} pageView - Page view data
 * @returns {Promise<void>}
 */
async function appendPageView(pageView) {
  const db = getDatabase();
  if (!db) {
    throw new Error('Firebase Database not available');
  }

  const ref = db.ref('analytics/pageViews');
  const newRef = ref.push();
  await newRef.set(pageView);
}

/**
 * Read all page views from Firebase
 * @returns {Promise<Array<Object>>} Array of page view records
 */
async function readPageViews() {
  const db = getDatabase();
  if (!db) {
    throw new Error('Firebase Database not available');
  }

  const ref = db.ref('analytics/pageViews');
  const snapshot = await ref.once('value');
  const data = snapshot.val();

  if (!data) return [];

  return Object.entries(data).map(([id, value]) => ({
    _id: id,
    ...value,
  }));
}

/**
 * Clear all page views from Firebase
 * @returns {Promise<void>}
 */
async function clearPageViews() {
  const db = getDatabase();
  if (!db) {
    throw new Error('Firebase Database not available');
  }

  const ref = db.ref('analytics/pageViews');
  await ref.remove();
}

module.exports = {
  getDatabase,
  isFirebaseDbAvailable,
  saveRecord,
  readRecords,
  appendPageView,
  readPageViews,
  clearPageViews,
};
