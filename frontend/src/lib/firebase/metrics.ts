import { ref, set, get, update, increment, onValue, off, serverTimestamp, runTransaction } from 'firebase/database'
import { database } from './config'

// ==================== STORIES METRICS ====================

/**
 * Incrementează numărul de vizualizări pentru o story
 */
export const incrementStoryViews = async (storyId: string | number): Promise<void> => {
  const storyRef = ref(database, `stories/${storyId}/views`)
  try {
    await set(storyRef, increment(1))
  } catch (error) {
    console.error('Error incrementing story views:', error)
  }
}

/**
 * Obține numărul de vizualizări pentru o story
 */
export const getStoryViews = async (storyId: string | number): Promise<number> => {
  const storyRef = ref(database, `stories/${storyId}/views`)
  try {
    const snapshot = await get(storyRef)
    return snapshot.val() || 0
  } catch (error) {
    console.error('Error getting story views:', error)
    return 0
  }
}

/**
 * Ascultă în timp real schimbările de vizualizări
 */
export const subscribeToStoryViews = (
  storyId: string | number,
  callback: (views: number) => void
): (() => void) => {
  const storyRef = ref(database, `stories/${storyId}/views`)
  
  onValue(storyRef, (snapshot) => {
    callback(snapshot.val() || 0)
  })

  // Return unsubscribe function
  return () => off(storyRef)
}

// ==================== VIDEO TESTIMONIALS METRICS ====================

/**
 * Toggle like pentru un testimonial
 */
export const toggleTestimonialLike = async (
  testimonialId: string | number,
  userId: string
): Promise<boolean> => {
  const likeRef = ref(database, `testimonials/${testimonialId}/likes/${userId}`)
  const likesCountRef = ref(database, `testimonials/${testimonialId}/likesCount`)
  
  try {
    const snapshot = await get(likeRef)
    const isLiked = snapshot.exists()

    if (isLiked) {
      // Unlike
      await set(likeRef, null)
      await set(likesCountRef, increment(-1))
      return false
    } else {
      // Like
      await set(likeRef, {
        timestamp: serverTimestamp()
      })
      await set(likesCountRef, increment(1))
      return true
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return false
  }
}

/**
 * Verifică dacă user-ul a dat like
 */
export const checkIfUserLiked = async (
  testimonialId: string | number,
  userId: string
): Promise<boolean> => {
  const likeRef = ref(database, `testimonials/${testimonialId}/likes/${userId}`)
  try {
    const snapshot = await get(likeRef)
    return snapshot.exists()
  } catch (error) {
    console.error('Error checking like status:', error)
    return false
  }
}

/**
 * Obține numărul total de likes
 */
export const getTestimonialLikes = async (testimonialId: string | number): Promise<number> => {
  const likesCountRef = ref(database, `testimonials/${testimonialId}/likesCount`)
  try {
    const snapshot = await get(likesCountRef)
    return snapshot.val() || 0
  } catch (error) {
    console.error('Error getting likes count:', error)
    return 0
  }
}

/**
 * Ascultă în timp real schimbările de likes
 */
export const subscribeToTestimonialLikes = (
  testimonialId: string | number,
  callback: (likes: number) => void
): (() => void) => {
  const likesCountRef = ref(database, `testimonials/${testimonialId}/likesCount`)
  
  onValue(likesCountRef, (snapshot) => {
    callback(snapshot.val() || 0)
  })

  return () => off(likesCountRef)
}

/**
 * Incrementează numărul de comentarii
 */
export const incrementTestimonialComments = async (testimonialId: string | number): Promise<void> => {
  const commentsCountRef = ref(database, `testimonials/${testimonialId}/commentsCount`)
  try {
    await set(commentsCountRef, increment(1))
  } catch (error) {
    console.error('Error incrementing comments:', error)
  }
}

/**
 * Obține numărul de comentarii
 */
export const getTestimonialComments = async (testimonialId: string | number): Promise<number> => {
  const commentsCountRef = ref(database, `testimonials/${testimonialId}/commentsCount`)
  try {
    const snapshot = await get(commentsCountRef)
    return snapshot.val() || 0
  } catch (error) {
    console.error('Error getting comments count:', error)
    return 0
  }
}

/**
 * Adaugă un comentariu la un testimonial
 */
export const addTestimonialComment = async (
  testimonialId: string | number,
  userId: string,
  text: string,
  userName?: string
): Promise<void> => {
  const commentId = Date.now().toString()
  const commentRef = ref(database, `testimonials/${testimonialId}/comments/${commentId}`)
  const commentsCountRef = ref(database, `testimonials/${testimonialId}/commentsCount`)
  
  try {
    await set(commentRef, {
      userId,
      userName: userName || 'Utilizator',
      text,
      timestamp: serverTimestamp()
    })
    await set(commentsCountRef, increment(1))
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

/**
 * Obține comentariile pentru un testimonial
 */
export const getTestimonialCommentsList = async (
  testimonialId: string | number
): Promise<Array<{ id: string; userId: string; userName: string; text: string; timestamp: number }>> => {
  const commentsRef = ref(database, `testimonials/${testimonialId}/comments`)
  try {
    const snapshot = await get(commentsRef)
    if (!snapshot.exists()) return []
    
    const comments = snapshot.val()
    return Object.entries(comments).map(([id, data]: [string, any]) => ({
      id,
      userId: data.userId,
      userName: data.userName,
      text: data.text,
      timestamp: data.timestamp
    })).sort((a, b) => b.timestamp - a.timestamp)
  } catch (error) {
    console.error('Error getting comments:', error)
    return []
  }
}

/**
 * Ascultă în timp real schimbările de comentarii
 */
export const subscribeToTestimonialComments = (
  testimonialId: string | number,
  callback: (comments: Array<{ id: string; userId: string; userName: string; text: string; timestamp: number }>) => void
): (() => void) => {
  const commentsRef = ref(database, `testimonials/${testimonialId}/comments`)
  
  onValue(commentsRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([])
      return
    }
    
    const comments = snapshot.val()
    const commentsList = Object.entries(comments).map(([id, data]: [string, any]) => ({
      id,
      userId: data.userId,
      userName: data.userName,
      text: data.text,
      timestamp: data.timestamp
    })).sort((a, b) => b.timestamp - a.timestamp)
    
    callback(commentsList)
  })

  return () => off(commentsRef)
}

// ==================== LIVE STREAMS METRICS ====================

/**
 * Adaugă un spectator la un live stream
 */
export const joinLiveStream = async (
  streamId: string | number,
  userId: string
): Promise<void> => {
  const viewerRef = ref(database, `livestreams/${streamId}/viewers/${userId}`)
  const viewersCountRef = ref(database, `livestreams/${streamId}/viewersCount`)
  
  try {
    await set(viewerRef, {
      joinedAt: serverTimestamp()
    })
    await set(viewersCountRef, increment(1))
  } catch (error) {
    console.error('Error joining live stream:', error)
  }
}

/**
 * Elimină un spectator dintr-un live stream
 */
export const leaveLiveStream = async (
  streamId: string | number,
  userId: string
): Promise<void> => {
  const viewerRef = ref(database, `livestreams/${streamId}/viewers/${userId}`)
  const viewersCountRef = ref(database, `livestreams/${streamId}/viewersCount`)
  
  try {
    await set(viewerRef, null)
    await set(viewersCountRef, increment(-1))
  } catch (error) {
    console.error('Error leaving live stream:', error)
  }
}

/**
 * Obține numărul de spectatori live
 */
export const getLiveStreamViewers = async (streamId: string | number): Promise<number> => {
  const viewersCountRef = ref(database, `livestreams/${streamId}/viewersCount`)
  try {
    const snapshot = await get(viewersCountRef)
    return Math.max(0, snapshot.val() || 0) // Asigură că nu e negativ
  } catch (error) {
    console.error('Error getting live viewers:', error)
    return 0
  }
}

/**
 * Ascultă în timp real numărul de spectatori
 */
export const subscribeToLiveStreamViewers = (
  streamId: string | number,
  callback: (viewers: number) => void
): (() => void) => {
  const viewersCountRef = ref(database, `livestreams/${streamId}/viewersCount`)
  
  onValue(viewersCountRef, (snapshot) => {
    callback(Math.max(0, snapshot.val() || 0))
  })

  return () => off(viewersCountRef)
}

// ==================== BEFORE/AFTER STATS ====================

/**
 * Actualizează statisticile unui proiect Before/After
 */
export const updateProjectStats = async (
  projectId: number,
  stats: {
    volunteers?: number
    treesPlanted?: number
    wasteCollected?: number
    area?: number
  }
): Promise<void> => {
  const projectRef = ref(database, `projects/${projectId}/stats`)
  try {
    await update(projectRef, stats)
  } catch (error) {
    console.error('Error updating project stats:', error)
  }
}

/**
 * Obține statisticile unui proiect
 */
export const getProjectStats = async (projectId: number): Promise<any> => {
  const projectRef = ref(database, `projects/${projectId}/stats`)
  try {
    const snapshot = await get(projectRef)
    return snapshot.val() || {}
  } catch (error) {
    console.error('Error getting project stats:', error)
    return {}
  }
}

/**
 * Incrementează vizualizările unui proiect Before/After
 */
export const incrementBeforeAfterViews = async (projectId: string | number): Promise<void> => {
  const viewsRef = ref(database, `gallery/beforeAfter/${projectId}/views`)
  try {
    await runTransaction(viewsRef, (currentViews) => {
      return (currentViews || 0) + 1
    })
  } catch (error) {
    console.error(`Error incrementing before/after views for ${projectId}:`, error)
  }
}

/**
 * Obține numărul de vizualizări pentru un proiect Before/After
 */
export const getBeforeAfterViews = async (projectId: string | number): Promise<number> => {
  console.log(`[metrics] getBeforeAfterViews called for project: ${projectId}`)
  const viewsRef = ref(database, `gallery/beforeAfter/${projectId}/views`)
  try {
    const snapshot = await get(viewsRef)
    return snapshot.val() || 0
  } catch (error) {
    console.error(`Error getting before/after views for ${projectId}:`, error)
    return 0
  }
}

/**
 * Subscribe la vizualizările unui proiect Before/After
 */
export const subscribeToBeforeAfterViews = (
  projectId: string | number,
  callback: (views: number) => void
): (() => void) => {
  const viewsRef = ref(database, `gallery/beforeAfter/${projectId}/views`)
  
  onValue(viewsRef, (snapshot) => {
    const views = snapshot.val() || 0
    callback(views)
  })
  
  return () => {
    off(viewsRef)
  }
}



// ==================== UTILITY FUNCTIONS ====================

/**
 * Generează un ID unic pentru user (poate fi înlocuit cu Firebase Auth)
 */
export const generateUserId = (): string => {
  const stored = localStorage.getItem('firebase_user_id')
  if (stored) return stored

  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('firebase_user_id', newId)
  return newId
}

/**
 * Inițializează datele default pentru o story nouă
 */
export const initializeStory = async (storyId: string | number, initialViews: number = 0): Promise<void> => {
  const storyRef = ref(database, `stories/${storyId}`)
  try {
    const snapshot = await get(storyRef)
    if (!snapshot.exists()) {
      await set(storyRef, {
        views: initialViews,
        createdAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error initializing story:', error)
  }
}

/**
 * Inițializează datele default pentru un testimonial nou
 */
export const initializeTestimonial = async (
  testimonialId: string | number,
  initialLikes: number = 0,
  initialComments: number = 0
): Promise<void> => {
  const testimonialRef = ref(database, `testimonials/${testimonialId}`)
  try {
    const snapshot = await get(testimonialRef)
    if (!snapshot.exists()) {
      await set(testimonialRef, {
        likesCount: initialLikes,
        commentsCount: initialComments,
        likes: {},
        createdAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error initializing testimonial:', error)
  }
}
