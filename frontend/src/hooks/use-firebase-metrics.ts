import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  incrementStoryViews,
  subscribeToStoryViews,
  toggleTestimonialLike,
  subscribeToTestimonialLikes,
  checkIfUserLiked,
  joinLiveStream,
  leaveLiveStream,
  subscribeToLiveStreamViewers,
  generateUserId,
  getTestimonialComments,
  getStoryViews,
  getTestimonialLikes,
  getLiveStreamViewers,
  addTestimonialComment,
  subscribeToTestimonialComments,
  incrementBeforeAfterViews,
  getBeforeAfterViews,
  subscribeToBeforeAfterViews,

} from '@/lib/firebase/metrics'

// ==================== STORY VIEWS HOOK ====================

export const useStoryViews = (storyId: string | number) => {
  const [views, setViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obține views inițial
    getStoryViews(storyId).then((initialViews) => {
      setViews(initialViews)
      setLoading(false)
    })

    // Subscribe la actualizări în timp real
    const unsubscribe = subscribeToStoryViews(storyId, (newViews) => {
      setViews(newViews)
    })

    return () => unsubscribe()
  }, [storyId])

  const incrementViews = useCallback(async () => {
    await incrementStoryViews(storyId)
  }, [storyId])

  return { views, incrementViews, loading }
}

// ==================== TESTIMONIAL LIKES HOOK ====================

export const useTestimonialLikes = (testimonialId: string | number, userId?: string) => {
  const [likes, setLikes] = useState<number>(0)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const generatedUserId = useMemo(() => userId || generateUserId(), [userId])

  useEffect(() => {
    // Obține likes și status inițial
    Promise.all([
      getTestimonialLikes(testimonialId),
      checkIfUserLiked(testimonialId, generatedUserId)
    ]).then(([initialLikes, liked]) => {
      setLikes(initialLikes)
      setIsLiked(liked)
      setLoading(false)
    })

    // Subscribe la actualizări în timp real
    const unsubscribe = subscribeToTestimonialLikes(testimonialId, (newLikes) => {
      setLikes(newLikes)
    })

    return () => unsubscribe()
  }, [testimonialId, generatedUserId])

  const toggleLike = useCallback(async () => {
    const newLikedState = await toggleTestimonialLike(testimonialId, generatedUserId)
    setIsLiked(newLikedState)
  }, [testimonialId, generatedUserId])

  return { likes, isLiked, toggleLike, loading }
}

// ==================== TESTIMONIAL COMMENTS HOOK ====================

export const useTestimonialComments = (testimonialId: string | number, userId?: string) => {
  const [comments, setComments] = useState<number>(0)
  const [commentsList, setCommentsList] = useState<Array<{ id: string; userId: string; userName: string; text: string; timestamp: number }>>([])
  const [loading, setLoading] = useState(true)
  const generatedUserId = useMemo(() => userId || generateUserId(), [userId])

  useEffect(() => {
    // Obține numărul de comentarii
    getTestimonialComments(testimonialId).then((initialComments) => {
      setComments(initialComments)
      setLoading(false)
    })

    // Subscribe la lista de comentarii în timp real
    const unsubscribe = subscribeToTestimonialComments(testimonialId, (newComments) => {
      setCommentsList(newComments)
      setComments(newComments.length)
    })

    return () => unsubscribe()
  }, [testimonialId])

  const addComment = useCallback(async (text: string, userName?: string) => {
    await addTestimonialComment(testimonialId, generatedUserId, text, userName)
  }, [testimonialId, generatedUserId])

  return { comments, commentsList, addComment, loading }
}

// ==================== LIVE STREAM VIEWERS HOOK ====================

export const useLiveStreamViewers = (streamId: string | number, autoJoin: boolean = false) => {
  const [viewers, setViewers] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [hasJoined, setHasJoined] = useState(false)
  const userId = useMemo(() => generateUserId(), [])

  useEffect(() => {
    // Obține viewers inițial
    getLiveStreamViewers(streamId).then((initialViewers) => {
      setViewers(initialViewers)
      setLoading(false)
    })

    // Subscribe la actualizări în timp real
    const unsubscribe = subscribeToLiveStreamViewers(streamId, (newViewers) => {
      setViewers(newViewers)
    })

    // Auto-join dacă e specificat
    if (autoJoin && !hasJoined) {
      joinLiveStream(streamId, userId)
      setHasJoined(true)
    }

    // Cleanup: părăsește stream-ul când componenta se demontează
    return () => {
      unsubscribe()
      if (hasJoined) {
        leaveLiveStream(streamId, userId)
      }
    }
  }, [streamId, autoJoin, hasJoined, userId])

  const join = useCallback(async () => {
    if (!hasJoined) {
      await joinLiveStream(streamId, userId)
      setHasJoined(true)
    }
  }, [streamId, userId, hasJoined])

  const leave = useCallback(async () => {
    if (hasJoined) {
      await leaveLiveStream(streamId, userId)
      setHasJoined(false)
    }
  }, [streamId, userId, hasJoined])

  return { viewers, join, leave, hasJoined, loading }
}

// ==================== COMBINED TESTIMONIAL METRICS HOOK ====================

export const useTestimonialMetrics = (testimonialId: string | number) => {
  const { likes, isLiked, toggleLike, loading: likesLoading } = useTestimonialLikes(testimonialId)
  const { comments, loading: commentsLoading } = useTestimonialComments(testimonialId)

  return {
    likes,
    isLiked,
    toggleLike,
    comments,
    loading: likesLoading || commentsLoading
  }
}

// ==================== BEFORE/AFTER VIEWS HOOK ====================

export const useBeforeAfterViews = (projectId: string | number) => {
  const [views, setViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obține views inițial
    getBeforeAfterViews(projectId).then((initialViews) => {
      setViews(initialViews)
      setLoading(false)
    })

    // Subscribe la actualizări în timp real
    const unsubscribe = subscribeToBeforeAfterViews(projectId, (newViews) => {
      setViews(newViews)
    })

    return () => unsubscribe()
  }, [projectId])

  const incrementViews = useCallback(async () => {
    await incrementBeforeAfterViews(projectId)
  }, [projectId])

  return { views, incrementViews, loading }
}


