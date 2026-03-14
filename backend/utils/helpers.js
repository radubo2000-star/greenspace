// ============================================
// HELPER FUNCTIONS
// ============================================
// Reusable utility functions

const fs = require('fs');
const path = require('path');
const config = require('../config');
const transporter = require('../config/nodemailer');
const firebaseStore = require('./firebase-store');

/**
 * @typedef {Object} SaveResult
 * @property {string} filename
 * @property {string} filepath
 */

/**
 * @typedef {Object} EmailResult
 * @property {boolean} saved
 * @property {boolean} sent
 */

/**
 * Read all JSON files from a folder
 * @param {string} folderPath - Path to the folder
 * @returns {Array<Object>} Array of parsed JSON objects, sorted by timestamp (newest first)
 */
function readJsonFiles(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  const files = fs.readdirSync(folderPath);
  const jsonFiles = files.filter(file => file.endsWith('.json'));
  
  return jsonFiles.map(file => {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Save data to JSON file (filesystem fallback)
 * @param {string} folder - Folder path
 * @param {string} prefix - Filename prefix
 * @param {Object} data - Data to save
 * @returns {SaveResult} Object with filename and filepath
 */
function saveToJsonFile(folder, prefix, data) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  
  const timestamp = Date.now();
  const filename = `${prefix}_${timestamp}.json`;
  const filepath = path.join(folder, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  
  return { filename, filepath };
}

/**
 * Save data to Firebase Realtime DB, with file-based fallback.
 * @param {string} collection - Firebase collection path (e.g. 'forms/contacts')
 * @param {string} fallbackFolder - Filesystem folder path for fallback
 * @param {string} fallbackPrefix - Filename prefix for fallback
 * @param {Object} data - Data to save
 * @returns {Promise<{id?: string, filename?: string, filepath?: string}>}
 */
async function saveData(collection, fallbackFolder, fallbackPrefix, data) {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      return await firebaseStore.saveRecord(collection, data);
    } catch (error) {
      console.warn('Firebase save failed, falling back to file:', error.message);
    }
  }
  return saveToJsonFile(fallbackFolder, fallbackPrefix, data);
}

/**
 * Read all records from Firebase Realtime DB, with file-based fallback.
 * @param {string} collection - Firebase collection path
 * @param {string} fallbackFolder - Filesystem folder path for fallback
 * @returns {Promise<Array<Object>>}
 */
async function readData(collection, fallbackFolder) {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      return await firebaseStore.readRecords(collection);
    } catch (error) {
      console.warn('Firebase read failed, falling back to file:', error.message);
    }
  }
  return readJsonFiles(fallbackFolder);
}

/**
 * Send email (with fallback to file storage if SMTP not configured)
 * @param {Object} mailOptions - Nodemailer mail options
 * @param {string} fallbackFolder - Folder to save to if email fails
 * @param {string} fallbackPrefix - Filename prefix for fallback
 * @param {Object} fallbackData - Data to save if email fails
 * @returns {Promise<EmailResult>} Object with saved and sent flags
 */
async function sendEmailOrSave(mailOptions, fallbackFolder, fallbackPrefix, fallbackData) {
  if (!config.isEmailConfigured()) {
    console.log(`📧 Email not configured, saving to file: ${fallbackPrefix}`);
    saveToJsonFile(fallbackFolder, fallbackPrefix, fallbackData);
    return { saved: true, sent: false };
  }
  
  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully: ${mailOptions.subject}`);
    return { saved: false, sent: true };
  } catch (error) {
    console.error('❌ Email error:', error);
    throw error;
  }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  readJsonFiles,
  saveToJsonFile,
  saveData,
  readData,
  sendEmailOrSave,
  isValidEmail
};
