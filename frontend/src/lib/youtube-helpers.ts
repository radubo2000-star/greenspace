/**
 * Shared YouTube URL helpers
 *
 * Centralises YouTube video-ID extraction, embed-URL conversion and
 * thumbnail generation so every admin component uses the same logic.
 */

/** Patterns that match the most common YouTube URL formats. */
const YOUTUBE_ID_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#\s]+)/,
  /youtube\.com\/shorts\/([^&\n?#\s]+)/,
  /youtube\.com\/v\/([^&\n?#\s]+)/,
]

/**
 * Extract the video ID from any YouTube URL format.
 * Returns `null` when the URL is not a recognised YouTube link.
 */
export const extractYouTubeId = (url: string): string | null => {
  if (!url) return null

  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

/**
 * Return the `maxresdefault` thumbnail URL for a YouTube video.
 * Returns an empty string when the URL is not a YouTube link.
 */
export const getYouTubeThumbnail = (url: string): string => {
  const videoId = extractYouTubeId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''
}

/**
 * Convert any YouTube URL to its `/embed/` equivalent.
 * Non-YouTube URLs are returned unchanged.
 */
export const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return ''
  if (url.includes('/embed/')) return url

  const videoId = extractYouTubeId(url)
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

/** Returns `true` when the URL points to YouTube. */
export const isYouTubeUrl = (url: string): boolean =>
  url.includes('youtube.com') || url.includes('youtu.be')
