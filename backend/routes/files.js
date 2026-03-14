// ============================================
// FILE MANAGEMENT ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const { dataFolder } = require('../utils/folders');
const logger = require('../utils/logger');

const allowedFolders = [
  'contacts',
  'volunteers',
  'members',
  'partnerships',
  'donations',
  'analytics',
  'analytics/page-views',
  'uploads',
  'uploads/images',
  'uploads/videos'
];

/**
 * Check whether a requested path is inside one of the allowed folders.
 * @param {string} requestedPath - The normalised path to check
 * @returns {boolean}
 */
function isPathAllowed(requestedPath) {
  const normalizedPath = requestedPath.replace(/\\/g, '/');
  return allowedFolders.some(allowed => {
    const normalizedAllowed = allowed.replace(/\\/g, '/');
    return normalizedPath === normalizedAllowed || normalizedPath.startsWith(normalizedAllowed + '/');
  });
}

/**
 * Validate and resolve a requested path against the allowed folders list.
 * Returns the safe absolute path if valid, or sends an error response and returns null.
 * @param {string} requestedPath - The user-supplied path
 * @param {import('express').Response} res - Express response object
 * @returns {string|null} Resolved safe path, or null if validation failed (response already sent)
 */
function validateAndResolvePath(requestedPath, res) {
  if (!requestedPath) {
    res.status(400).json({ success: false, error: 'Calea fișierului este obligatorie' });
    return null;
  }

  if (!isPathAllowed(requestedPath)) {
    res.status(403).json({ success: false, error: 'Acces interzis la acest director' });
    return null;
  }

  const safePath = path.join(dataFolder, requestedPath);
  if (!safePath.startsWith(dataFolder)) {
    res.status(403).json({ success: false, error: 'Acces interzis' });
    return null;
  }

  if (!fs.existsSync(safePath)) {
    res.status(404).json({ success: false, error: 'Calea nu există' });
    return null;
  }

  return safePath;
}

/**
 * Get files in a directory.
 * Handles both / and /list endpoints.
 * Uses async fs operations to avoid blocking the event loop.
 */
const listFilesHandler = async (req, res) => {
  try {
    const requestedPath = req.query.path || '';
    const basePath = dataFolder;
    
    if (!requestedPath) {
      const topLevelFolders = allowedFolders.filter(folder => !folder.includes('/'));
      const rootFolders = [];

      for (const folder of topLevelFolders) {
        const folderPath = path.join(basePath, folder);
        try {
          const stats = await fsp.stat(folderPath);
          rootFolders.push({
            name: folder,
            path: folder,
            type: 'directory',
            size: undefined,
            modified: stats.mtime.toISOString()
          });
        } catch {
          // Folder doesn't exist — skip it
        }
      }

      rootFolders.sort((a, b) => a.name.localeCompare(b.name));

      return res.json({
        success: true,
        path: '',
        files: rootFolders
      });
    }
    
    if (!isPathAllowed(requestedPath)) {
      return res.status(403).json({
        success: false,
        error: 'Acces interzis la acest director'
      });
    }
    
    const safePath = path.join(basePath, requestedPath);
    if (!safePath.startsWith(basePath)) {
      return res.status(403).json({
        success: false,
        error: 'Acces interzis'
      });
    }

    try {
      await fsp.access(safePath);
    } catch {
      return res.status(404).json({
        success: false,
        error: 'Calea nu există'
      });
    }

    const items = await fsp.readdir(safePath);
    const files = [];

    for (const item of items) {
      if (item.startsWith('.')) continue;
      const itemPath = path.join(safePath, item);
      const stats = await fsp.stat(itemPath);
      const relativePath = path.relative(basePath, itemPath);
      
      files.push({
        name: item,
        path: relativePath,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.isFile() ? stats.size : undefined,
        modified: stats.mtime.toISOString()
      });
    }

    files.sort((a, b) => {
      if (a.type === 'directory' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });

    res.json({
      success: true,
      path: requestedPath,
      files
    });
  } catch (error) {
    logger.error('Error reading files:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la citirea fișierelor'
    });
  }
};

// Mount the handler on both routes
router.get('/', listFilesHandler);
router.get('/list', listFilesHandler);

/**
 * Download a file
 */
router.get('/download', (req, res) => {
  try {
    const safePath = validateAndResolvePath(req.query.path, res);
    if (!safePath) return;

    const stats = fs.statSync(safePath);
    if (!stats.isFile()) {
      return res.status(400).json({
        success: false,
        error: 'Calea nu este un fișier'
      });
    }

    const filename = path.basename(safePath);
    res.download(safePath, filename);
  } catch (error) {
    logger.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la descărcarea fișierului'
    });
  }
});

/**
 * Delete a file
 */
router.delete('/', (req, res) => {
  try {
    const safePath = validateAndResolvePath(req.query.path, res);
    if (!safePath) return;

    const stats = fs.statSync(safePath);
    if (!stats.isFile()) {
      return res.status(400).json({
        success: false,
        error: 'Doar fișierele pot fi șterse'
      });
    }

    fs.unlinkSync(safePath);

    res.json({
      success: true,
      message: 'Fișier șters cu succes'
    });
  } catch (error) {
    logger.error('Error deleting file:', error);
    res.status(500).json({
      success: false,
      error: 'Eroare la ștergerea fișierului'
    });
  }
});

module.exports = router;
