// ============================================
// FIREBASE ADMIN SDK CONFIGURATION
// ============================================
// Initializes Firebase Admin for server-side token verification
// and Realtime Database access.
//
// Authentication options (checked in order):
// 1. GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account JSON file
// 2. FIREBASE_SERVICE_ACCOUNT env var containing the JSON string directly
// 3. Application Default Credentials (works on GCP, Cloud Run, etc.)
//
// Required env var for database URL:
//   FIREBASE_DATABASE_URL  (e.g. https://your-project-default-rtdb.firebaseio.com)

const admin = require('firebase-admin');

let _hasCredentials = false;

function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin;
  }

  const databaseURL = process.env.FIREBASE_DATABASE_URL;

  // Option 1: GOOGLE_APPLICATION_CREDENTIALS is handled automatically by the SDK
  // Option 2: Inline service account JSON
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL,
      });
      _hasCredentials = true;
      console.log('Firebase Admin initialized with service account JSON');
      return admin;
    } catch (err) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', err.message);
    }
  }

  // Option 3: Application Default Credentials / GOOGLE_APPLICATION_CREDENTIALS
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL,
      });
      _hasCredentials = true;
      console.log('Firebase Admin initialized with application default credentials');
      return admin;
    } catch (err) {
      console.error('Failed to use GOOGLE_APPLICATION_CREDENTIALS:', err.message);
    }
  }

  // Fallback: initialize without credentials (token verification will be unavailable)
  console.warn('Firebase Admin: no credentials found. Token verification will be unavailable.');
  console.warn('Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS to enable.');
  admin.initializeApp({ databaseURL });

  return admin;
}

const firebaseAdmin = initializeFirebaseAdmin();

/**
 * Returns true when a service account or application default credential
 * was successfully loaded at startup.  When false, verifyIdToken() will
 * always fail so the auth middleware should fall back to presence-only.
 */
function hasCredentials() {
  return _hasCredentials;
}

module.exports = firebaseAdmin;
module.exports.hasCredentials = hasCredentials;
