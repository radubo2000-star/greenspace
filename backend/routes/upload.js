// ============================================
// FILE UPLOAD ROUTES
// ============================================

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../config/multer');
const config = require('../config');
const { uploadFolder, videoUploadFolder } = require('../utils/folders');
const adminAuth = require('../middleware/adminAuth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const logger = require('../utils/logger');

// Placeholder SVG used when FFmpeg is unavailable for video thumbnail generation
const VIDEO_PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%236366f1;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%234f46e5;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="600"/%3E%3Ccircle cx="200" cy="280" r="60" fill="white" opacity="0.9"/%3E%3Ccircle cx="200" cy="280" r="50" fill="%236366f1"/%3E%3Cpath d="M 180 260 L 180 300 L 220 280 Z" fill="white"/%3E%3Ctext fill="white" x="50%25" y="65%25" text-anchor="middle" dy=".3em" font-size="16" font-family="Arial"%3EVideo Local%3C/text%3E%3C/svg%3E';

/**
 * Check if file exists
 */
router.post('/check-file', adminAuth, (req, res) => {
  try {
    const { filename, type } = req.body;
    
    if (!filename) {
      return res.status(400).json({
        success: false,
        error: 'Numele fișierului este obligatoriu'
      });
    }

    const isVideo = type === 'video';
    const folder = isVideo ? videoUploadFolder : uploadFolder;
    const filePath = path.join(folder, filename);
    const exists = fs.existsSync(filePath);

    res.json({
      success: true,
      exists: exists,
      filename: filename,
    });
  } catch (error) {
    logger.error('❌ Check file error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check file'
    });
  }
});

/**
 * Upload file (image or video)
 */
router.post('/upload', adminAuth, uploadLimiter, (req, res) => {
  logger.debug('📥 Upload request received');
  logger.debug('📊 Content-Length:', req.headers['content-length']);
  logger.debug('📝 Content-Type:', req.headers['content-type']);

  upload.single('file')(req, res, function (err) {
    if (err) {
      logger.error('❌ MULTER ERROR:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    if (!req.file) {
      logger.debug('❌ No file in request');
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const isVideo = req.file.mimetype.startsWith('video/');
    const type = isVideo ? 'video' : 'image';

    const fileUrl = isVideo
      ? `${config.backendUrl}/data/uploads/videos/${req.file.filename}`
      : `${config.backendUrl}/data/uploads/images/${req.file.filename}`;

    logger.info(`✅ ${type.toUpperCase()} uploaded:`, {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: (req.file.size / 1024).toFixed(2) + ' KB',
      url: fileUrl
    });

    return res.json({
      success: true,
      message: 'Upload successful!',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: (req.file.size / 1024).toFixed(2) + ' KB',
        mimetype: req.file.mimetype,
        type: type,
        url: fileUrl
      }
    });
  });
});

/**
 * Delete uploaded file (image or video).
 * Shared handler — the :type param selects the target folder.
 */
router.delete('/data/uploads/:type/:filename', adminAuth, (req, res) => {
  try {
    const { type, filename } = req.params;

    const folder = type === 'videos' ? videoUploadFolder : uploadFolder;
    const filePath = path.join(folder, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    fs.unlinkSync(filePath);
    logger.info(`🗑️ ${type === 'videos' ? 'Video' : 'Image'} deleted:`, filename);

    res.json({ 
      success: true, 
      message: 'File deleted successfully',
      filename: filename
    });
  } catch (error) {
    logger.error('❌ Delete error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete file'
    });
  }
});

/**
 * List all uploaded files
 */
router.get('/list', adminAuth, (req, res) => {
  try {
    const imageFiles = fs.existsSync(uploadFolder) ? fs.readdirSync(uploadFolder) : [];
    const images = imageFiles.map(filename => {
      const filePath = path.join(uploadFolder, filename);
      const stats = fs.statSync(filePath);
      return {
        filename: filename,
        url: `${config.backendUrl}/data/uploads/images/${filename}`,
        size: stats.size,
        type: 'image',
        mimetype: 'image/' + filename.split('.').pop(),
        createdAt: stats.birthtime
      };
    });

    const videoFiles = fs.existsSync(videoUploadFolder) ? fs.readdirSync(videoUploadFolder) : [];
    const videos = videoFiles.map(filename => {
      const filePath = path.join(videoUploadFolder, filename);
      const stats = fs.statSync(filePath);
      return {
        filename: filename,
        url: `${config.backendUrl}/data/uploads/videos/${filename}`,
        size: stats.size,
        type: 'video',
        mimetype: 'video/' + filename.split('.').pop(),
        createdAt: stats.birthtime
      };
    });

    const allFiles = [...images, ...videos].sort((a, b) => b.createdAt - a.createdAt);

    res.json({ 
      success: true, 
      count: allFiles.length,
      files: allFiles,
      images: images,
      videos: videos
    });
  } catch (error) {
    logger.error('❌ List error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list files'
    });
  }
});

/**
 * Generate video thumbnail
 */
router.post('/generate-video-thumbnail', adminAuth, async (req, res) => {
  try {
    const { videoUrl } = req.body;
    
    if (!videoUrl) {
      return res.status(400).json({
        success: false,
        error: 'URL-ul video-ului este obligatoriu'
      });
    }

    const isLocalVideo = videoUrl.includes('/data/uploads/videos/') || videoUrl.includes('/uploads/videos/');
    
    if (!isLocalVideo) {
      return res.status(400).json({
        success: false,
        error: 'Generarea thumbnail-urilor este disponibilă doar pentru video-uri locale'
      });
    }

    // Sanitize filename to prevent directory traversal
    const rawFilename = videoUrl.split('/').pop();
    const filename = path.basename(rawFilename);
    const videoPath = path.join(videoUploadFolder, filename);

    // Validate the resolved path stays within the video upload folder
    const resolvedPath = path.resolve(videoPath);
    const resolvedFolder = path.resolve(videoUploadFolder);
    if (!resolvedPath.startsWith(resolvedFolder + path.sep) && resolvedPath !== resolvedFolder) {
      return res.status(400).json({
        success: false,
        error: 'Numele fișierului nu este valid'
      });
    }

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        error: 'Video-ul nu a fost găsit'
      });
    }

    const thumbnailFilename = filename.replace(/\.(mp4|webm|mov|avi|mpeg)$/i, '_thumb.jpg');
    const thumbnailPath = path.join(uploadFolder, thumbnailFilename);

    if (fs.existsSync(thumbnailPath)) {
      return res.json({
        success: true,
        message: 'Thumbnail existent',
        thumbnailUrl: `${config.backendUrl}/data/uploads/images/${thumbnailFilename}`
      });
    }

    try {
      const ffmpeg = require('fluent-ffmpeg');
      
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['1'],
          filename: thumbnailFilename,
          folder: uploadFolder,
          size: '1280x720'
        })
        .on('end', () => {
          logger.info('✅ Thumbnail generated:', thumbnailFilename);
          res.json({
            success: true,
            message: 'Thumbnail generat cu succes',
            thumbnailUrl: `${config.backendUrl}/data/uploads/images/${thumbnailFilename}`
          });
        })
        .on('error', (err) => {
          logger.error('❌ FFmpeg error:', err.message);
          res.json({
            success: true,
            message: 'FFmpeg nu este disponibil, se folosește placeholder',
            thumbnailUrl: VIDEO_PLACEHOLDER_SVG,
            usePlaceholder: true
          });
        });
    } catch (ffmpegError) {
      logger.error('❌ FFmpeg not available:', ffmpegError.message);
      res.json({
        success: true,
        message: 'FFmpeg nu este disponibil, se folosește placeholder',
        thumbnailUrl: VIDEO_PLACEHOLDER_SVG,
        usePlaceholder: true
      });
    }
  } catch (error) {
    logger.error('❌ Generate thumbnail error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate thumbnail'
    });
  }
});

module.exports = router;
