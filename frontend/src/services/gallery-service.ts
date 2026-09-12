// ============================================
// GALLERY SERVICE (backend REST)
// ============================================
// CRUD + metrics for the gallery (stories, video testimonials,
// before/after projects, live streams). All data lives in MySQL and
// is reached through the backend API.

import { getBackendUrl } from '@/lib/backend-config';

// Types
export interface Story {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  location: string;
  title: string;
  description: string;
  date: string;
  timestamp: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  duration?: string;
  rating: number;
  timestamp: number;
  createdAt?: number;
}

export interface BeforeAfterProject {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  beforeImage: string;
  afterImage: string;
  category: string;
  volunteers?: number;
  treesPlanted?: number;
  wasteCollected?: number;
  area?: number;
  timestamp: number;
}

export interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnail: string;
  scheduledTime: string;
  isLive: boolean;
  viewers: number;
  durationHours?: number;
  timestamp: number;
}

/** Single source of truth for API paths (matches backend/routes/gallery.js). */
const BASE = '/gallery';

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((data as { error?: string }).error || 'Eroare la comunicarea cu serverul.');
  }
  return data as T;
}

// ============================================
// Generic CRUD helpers
// ============================================

function createCRUD<T extends { id: string }, CreateInput = Omit<T, 'id'>>(
  collection: string,
  listKey: string,
) {
  const create = async (item: CreateInput): Promise<string> => {
    const data = await api<{ id: string }>(`${BASE}/${collection}`, {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return data.id;
  };

  const update = async (id: string, item: Partial<T>): Promise<void> => {
    await api(`${BASE}/${collection}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  };

  const deleteItem = async (id: string): Promise<void> => {
    await api(`${BASE}/${collection}/${id}`, { method: 'DELETE' });
  };

  const getAll = async (): Promise<T[]> => {
    const data = await api<{ success: boolean; [k: string]: unknown }>(`${BASE}/${collection}`);
    return (data[listKey] as T[] | undefined) || [];
  };

  // Simple polling-based subscription. Backend returns the same array the
  // admin components use; we poll every 5s and only emit when data changed.
  const subscribe = (callback: (items: T[]) => void): (() => void) => {
    let cancelled = false;
    let lastJson = '';

    const poll = async () => {
      if (cancelled) return;
      try {
        const items = await getAll();
        const json = JSON.stringify(items);
        if (json !== lastJson) {
          lastJson = json;
          callback(items);
        }
      } catch {
        // Silent — keep polling.
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  };

  return { create, update, delete: deleteItem, subscribe, getAll };
}

// ============================================
// Concrete CRUD instances
// ============================================

const storiesCRUD = createCRUD<Story>('stories', 'stories');
const testimonialsCRUD = createCRUD<Testimonial>('testimonials', 'testimonials');
const beforeAfterCRUD = createCRUD<BeforeAfterProject>('before-after', 'projects');
const liveStreamsCRUD = createCRUD<LiveStream>('live-streams', 'streams');

// ============================================
// Named exports (preserve existing public API)
// ============================================

// Stories
export const createStory = storiesCRUD.create;
export const updateStory = storiesCRUD.update;
export const deleteStory = storiesCRUD.delete;
export const subscribeToStories = storiesCRUD.subscribe;
export const getStories = storiesCRUD.getAll;

// Testimonials
export const createTestimonial = testimonialsCRUD.create;
export const updateTestimonial = testimonialsCRUD.update;
export const deleteTestimonial = testimonialsCRUD.delete;
export const subscribeToTestimonials = testimonialsCRUD.subscribe;
export const getTestimonials = testimonialsCRUD.getAll;

// Before/After Projects
export const createBeforeAfterProject = beforeAfterCRUD.create;
export const updateBeforeAfterProject = beforeAfterCRUD.update;
export const deleteBeforeAfterProject = beforeAfterCRUD.delete;
export const subscribeToBeforeAfterProjects = beforeAfterCRUD.subscribe;
export const getBeforeAfterProjects = beforeAfterCRUD.getAll;

// Live Streams
export const createLiveStream = liveStreamsCRUD.create;
export const updateLiveStream = liveStreamsCRUD.update;
export const deleteLiveStream = liveStreamsCRUD.delete;
export const subscribeToLiveStreams = liveStreamsCRUD.subscribe;
export const getLiveStreams = liveStreamsCRUD.getAll;