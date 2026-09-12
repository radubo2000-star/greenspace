import { useState, useEffect, useCallback, useMemo } from 'react'
import { getBackendUrl } from '@/lib/backend-config'

// ============================================
// GALLERY METRICS HOOKS (backend REST)
// ============================================
// Metrics (views, likes,
// comments, live viewers) now live in MySQL and are reached through
// /gallery/* endpoints. "Real-time" is approximated with polling.

const BASE = '/gallery';
const POLL_INTERVAL_MS = 5000;

interface Comment {
  id: string
  userId: string
  userName: string
  text: string
  timestamp: number
}

async function postJson<T>(path: string, body?: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${getBackendUrl()}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${getBackendUrl()}${path}`, {
      credentials: 'include',
    });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

// ==================== STORY VIEWS HOOK ====================

export const useStoryViews = (storyId: string | number) => {
  const [views, setViews] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true;

    const fetchViews = async () => {
      const data = await getJson<{ views: number }>(`${BASE}/stories/${storyId}/views`);
      if (active) {
        setViews(data?.views ?? 0);
        setLoading(false);
      }
    };

    fetchViews();
    const interval = setInterval(fetchViews, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [storyId])

  const incrementViews = useCallback(async () => {
    await postJson(`${BASE}/stories/${storyId}/views`);
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
    let active = true;

    const fetchLikes = async () => {
      const data = await getJson<{ likes: number; isLiked: boolean }>(
        `${BASE}/testimonials/${testimonialId}/likes?userId=${encodeURIComponent(generatedUserId)}`
      );
      if (active) {
        setLikes(data?.likes ?? 0);
        setIsLiked(data?.isLiked ?? false);
        setLoading(false);
      }
    };

    fetchLikes();
    const interval = setInterval(fetchLikes, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [testimonialId, generatedUserId])

  const toggleLike = useCallback(async () => {
    const data = await postJson<{ liked: boolean; likes: number }>(
      `${BASE}/testimonials/${testimonialId}/likes`,
      { userId: generatedUserId }
    );
    if (data) {
      setIsLiked(data.liked);
      setLikes(data.likes);
    }
  }, [testimonialId, generatedUserId])

  return { likes, isLiked, toggleLike, loading }
}

// ==================== TESTIMONIAL COMMENTS HOOK ====================

export const useTestimonialComments = (testimonialId: string | number, userId?: string) => {
  const [comments, setComments] = useState<number>(0)
  const [commentsList, setCommentsList] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const generatedUserId = useMemo(() => userId || generateUserId(), [userId])

  useEffect(() => {
    let active = true;

    const fetchComments = async () => {
      const data = await getJson<{ comments: Comment[] }>(
        `${BASE}/testimonials/${testimonialId}/comments`
      );
      if (active) {
        const list = data?.comments ?? [];
        setCommentsList(list);
        setComments(list.length);
        setLoading(false);
      }
    };

    fetchComments();
    const interval = setInterval(fetchComments, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [testimonialId])

  const addComment = useCallback(async (text: string, userName?: string) => {
    const data = await postJson<{ id: string }>(
      `${BASE}/testimonials/${testimonialId}/comments`,
      { userId: generatedUserId, userName, text }
    );
    if (data) {
      const newComment: Comment = {
        id: data.id,
        userId: generatedUserId,
        userName: userName || 'User',
        text,
        timestamp: Date.now(),
      };
      setCommentsList(prev => [newComment, ...prev]);
      setComments(prev => prev + 1);
    }
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
    let active = true;

    const fetchViewers = async () => {
      const data = await getJson<{ viewers: number }>(
        `${BASE}/live-streams/${streamId}/viewers`
      );
      if (active) {
        setViewers(data?.viewers ?? 0);
        setLoading(false);
      }
    };

    fetchViewers();
    const interval = setInterval(fetchViewers, POLL_INTERVAL_MS);

    // Auto-join dacă e specificat
    if (autoJoin && !hasJoined) {
      joinLiveStream(streamId, userId)
      setHasJoined(true)
    }

    // Cleanup: părăsește stream-ul când componenta se demontează
    return () => {
      active = false;
      clearInterval(interval);
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

async function joinLiveStream(streamId: string | number, userId: string) {
  await postJson(`${BASE}/live-streams/${streamId}/join`, { userId })
}

async function leaveLiveStream(streamId: string | number, userId: string) {
  await postJson(`${BASE}/live-streams/${streamId}/leave`, { userId })
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
    let active = true;

    const fetchViews = async () => {
      const data = await getJson<{ views: number }>(
        `${BASE}/before-after/${projectId}/views`
      );
      if (active) {
        setViews(data?.views ?? 0);
        setLoading(false);
      }
    };

    fetchViews();
    const interval = setInterval(fetchViews, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [projectId])

  const incrementViews = useCallback(async () => {
    await postJson(`${BASE}/before-after/${projectId}/views`);
  }, [projectId])

  return { views, incrementViews, loading }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generează un ID unic persistent pentru un vizitator anonim
 * (folosit pentru likes, comentarii și spectators — echivalentul
 * vechiului user id).
 */
export const generateUserId = (): string => {
  const stored = localStorage.getItem('greenspace_user_id')
  if (stored) return stored

  const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('greenspace_user_id', newId)
  return newId
}