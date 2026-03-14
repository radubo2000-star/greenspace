/**
 * Video Thumbnail Generator
 * Generates thumbnail images from video files
 */

import { getBackendUrl } from "./backend-config"

export interface ThumbnailOptions {
  timeInSeconds?: number // Time position to capture (default: 1 second)
  width?: number // Thumbnail width (default: 1280)
  height?: number // Thumbnail height (default: 720)
  quality?: number // JPEG quality 0-1 (default: 0.8)
}

/**
 * Generate a thumbnail from a video file
 * @param videoFile - The video file to generate thumbnail from
 * @param options - Thumbnail generation options
 * @returns Promise<File> - The generated thumbnail as a File object
 */
export const generateVideoThumbnail = async (
  videoFile: File,
  options: ThumbnailOptions = {}
): Promise<File> => {
  const {
    timeInSeconds = 1,
    width = 1280,
    height = 720,
    quality = 0.8
  } = options

  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Failed to get canvas context'))
      return
    }

    video.onloadedmetadata = () => {
      // Set the time to capture
      video.currentTime = Math.min(timeInSeconds, video.duration - 0.1)
    }

    video.onseeked = () => {
      try {
        // Calculate dimensions maintaining aspect ratio
        let targetWidth = width
        let targetHeight = height
        const videoRatio = video.videoWidth / video.videoHeight
        const targetRatio = width / height

        if (videoRatio > targetRatio) {
          targetHeight = width / videoRatio
        } else {
          targetWidth = height * videoRatio
        }

        canvas.width = targetWidth
        canvas.height = targetHeight

        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight)

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create thumbnail blob'))
              return
            }

            // Create filename from video name
            const videoName = videoFile.name.replace(/\.[^/.]+$/, '')
            const thumbnailName = `${videoName}-thumbnail.jpg`

            // Create File from blob
            const thumbnailFile = new File([blob], thumbnailName, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })

            // Cleanup
            URL.revokeObjectURL(video.src)
            resolve(thumbnailFile)
          },
          'image/jpeg',
          quality
        )
      } catch (error) {
        reject(error)
      }
    }

    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error('Failed to load video for thumbnail generation'))
    }

    // Load the video
    video.src = URL.createObjectURL(videoFile)
  })
}

/**
 * Extract filename from a URL path
 * @param url - The URL to extract filename from
 * @returns The filename without extension
 */
export const getFilenameFromUrl = (url: string): string => {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  return filename.replace(/\.[^/.]+$/, '')
}

/**
 * Generate thumbnail filename from video URL
 * @param videoUrl - The video URL
 * @returns The expected thumbnail filename
 */
export const getThumbnailFilenameFromVideoUrl = (videoUrl: string): string => {
  const filename = getFilenameFromUrl(videoUrl)
  return `${filename}-thumbnail.jpg`
}

/**
 * Get thumbnail URL from video URL
 * Assumes thumbnail is in /data/uploads/images/ with -thumbnail.jpg suffix
 * @param videoUrl - The video URL
 * @returns The thumbnail URL
 */
export const getThumbnailUrlFromVideoUrl = (videoUrl: string): string => {
  const filename = getThumbnailFilenameFromVideoUrl(videoUrl)
  const BACKEND_URL = getBackendUrl()
  
  return `${BACKEND_URL}/data/uploads/images/${filename}`
}

/**
 * Check if a URL is a local video
 * @param url - The URL to check
 * @returns true if it's a local video URL
 */
export const isLocalVideoUrl = (url: string): boolean => {
  return url.includes('/data/uploads/videos/') || url.includes('/uploads/videos/')
}
