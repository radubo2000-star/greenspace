/**
 * Helper function to get the correct image preview URL
 * Supports:
 * - Local backend URLs (http://localhost:5000/data/uploads/images/...)
 * - External URLs (https://... or http://...)
 * - Relative paths (/data/uploads/images/...) - converts to backend URL
 * 
 * @param path - The image path or URL
 * @returns The correct URL to display the image
 */

import { getBackendUrl } from './backend-config'

export const getImagePreview = (path: string): string => {
  if (!path) return ''

  const BACKEND_URL = getBackendUrl()

  // Already a full backend URL - return as is
  if (path.startsWith(`${BACKEND_URL}/data/uploads/images/`)) {
    return path
  }

  // Rewrite stale localhost URLs (e.g. port changed) to current backend
  const localhostMatch = path.match(/^https?:\/\/localhost:\d+(\/data\/uploads\/images\/.+)$/)
  if (localhostMatch) {
    return `${BACKEND_URL}${localhostMatch[1]}`
  }

  // External URLs (http/https) - return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Relative paths - convert to backend URL
  if (path.startsWith('/data/uploads/images/')) {
    return `${BACKEND_URL}${path}`
  }

  // Just filename - assume it's in uploads folder
  if (!path.includes('/')) {
    return `${BACKEND_URL}/data/uploads/images/${path}`
  }

  // Fallback: return as is (might be a data URL)
  return path
}

/**
 * Helper function to get the correct video preview URL
 * Supports:
 * - Local backend URLs (http://localhost:5000/data/uploads/videos...)
 * - External URLs (YouTube, Vimeo, etc.)
 * - Relative paths (/data/uploads/videos...) - converts to backend URL
 * 
 * @param path - The video path or URL
 * @returns The correct URL to display the video
 */
export const getVideoPreview = (path: string): string => {
  if (!path) return ''

  const BACKEND_URL = getBackendUrl()

  // Already a full backend URL - return as is
  if (path.startsWith(`${BACKEND_URL}/data/uploads/videos`)) {
    return path
  }

  // Rewrite stale localhost URLs (e.g. port changed) to current backend
  const localhostMatch = path.match(/^https?:\/\/localhost:\d+(\/data\/uploads\/videos.+)$/)
  if (localhostMatch) {
    return `${BACKEND_URL}${localhostMatch[1]}`
  }

  // External URLs (http/https) - return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // Relative paths - convert to backend URL
  if (path.startsWith('/data/uploads/videos')) {
    return `${BACKEND_URL}${path}`
  }

  // Just filename - assume it's in uploads folder
  if (!path.includes('/')) {
    return `${BACKEND_URL}/data/uploads/videos${path}`
  }

  // Fallback: return as is (might be a data URL)
  return path
}
