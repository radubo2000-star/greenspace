// ============================================
// FOLDER MANAGEMENT
// ============================================
// Creates and manages all data folders

const path = require('path');
const fs = require('fs');

// Data folder paths
const dataFolder = path.join(__dirname, '..', 'data');
const uploadFolder = path.join(dataFolder, 'uploads', 'images');
const videoUploadFolder = path.join(dataFolder, 'uploads', 'videos');

// All data folders that need to be created
const dataFolders = [
  dataFolder,
  path.join(dataFolder, 'donations'),
  path.join(dataFolder, 'volunteers'),
  path.join(dataFolder, 'members'),
  path.join(dataFolder, 'partnerships'),
  path.join(dataFolder, 'contacts'),
  path.join(dataFolder, 'analytics'),
  path.join(dataFolder, 'analytics', 'page-views'),
  path.join(dataFolder, 'uploads'),
  uploadFolder,
  videoUploadFolder
];

/**
 * Initialize all data folders
 */
function initializeFolders() {
  dataFolders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log('✅ Created folder:', folder);
    }
  });
}

module.exports = {
  dataFolder,
  uploadFolder,
  videoUploadFolder,
  initializeFolders
};
