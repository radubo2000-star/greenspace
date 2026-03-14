// ============================================
// MULTER CONFIGURATION (File Uploads)
// ============================================

const multer = require('multer');
const path = require('path');
const config = require('./index');
const { uploadFolder, videoUploadFolder } = require('../utils/folders');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isVideo = file.mimetype.startsWith('video/');
    const destination = isVideo ? videoUploadFolder : uploadFolder;
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    // Sanitize filename to prevent path traversal attacks:
    // Extract only the base name (strip any directory components like ../)
    // Keep the original name — the frontend already checks for duplicates via /check-file
    const baseName = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, baseName);
  }
});

const fileFilter = (req, file, cb) => {
  if (config.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, MOV, AVI) are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.maxVideoSize,
    fieldSize: 200 * 1024 * 1024,
    fields: 10,
    files: 1,
    parts: 1000,
    headerPairs: 2000
  }
});

module.exports = upload;
