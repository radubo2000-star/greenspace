import { database } from "@/lib/firebase/config";
import { ref, push, set, update, remove, onValue, get } from "firebase/database";
import { deleteMultipleFilesFromUrls } from "./storage-cleanup-service";

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

// ============================================
// Generic Firebase CRUD Factory
// ============================================

interface FirebaseCRUD<T extends { id: string }> {
  create: (item: Omit<T, "id">) => Promise<string>;
  update: (id: string, item: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  subscribe: (callback: (items: T[]) => void) => () => void;
  getAll: () => Promise<T[]>;
}

/**
 * Creates a reusable set of CRUD operations for a Firebase Realtime Database path.
 *
 * @param collectionPath - The database path (e.g. "gallery/stories")
 * @param getFileUrls    - Optional function that extracts file URLs from a record
 *                         so they can be deleted from Storage on record deletion.
 */
function createFirebaseCRUD<T extends { id: string }>(
  collectionPath: string,
  getFileUrls?: (item: T) => string[],
): FirebaseCRUD<T> {
  const create = async (item: Omit<T, "id">): Promise<string> => {
    const collectionRef = ref(database, collectionPath);
    const newItemRef = push(collectionRef);
    await set(newItemRef, {
      ...item,
      timestamp: Date.now(),
    });
    return newItemRef.key!;
  };

  const updateItem = async (id: string, item: Partial<T>): Promise<void> => {
    const itemRef = ref(database, `${collectionPath}/${id}`);
    await update(itemRef, item);
  };

  const deleteItem = async (id: string): Promise<void> => {
    const itemRef = ref(database, `${collectionPath}/${id}`);

    if (getFileUrls) {
      const snapshot = await get(itemRef);
      if (snapshot.exists()) {
        const record = snapshot.val() as T;
        const urls = getFileUrls(record).filter(Boolean);
        if (urls.length > 0) {
          await deleteMultipleFilesFromUrls(urls);
        }
      }
    }

    await remove(itemRef);
  };

  const subscribe = (callback: (items: T[]) => void): (() => void) => {
    const collectionRef = ref(database, collectionPath);

    const unsubscribe = onValue(collectionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([id, item]) => ({
          id,
          ...(item as Omit<T, "id">),
        })) as T[];
        callback(items);
      } else {
        callback([]);
      }
    });

    return () => unsubscribe();
  };

  const getAll = async (): Promise<T[]> => {
    const collectionRef = ref(database, collectionPath);
    const snapshot = await get(collectionRef);
    const data = snapshot.val();

    if (data) {
      return Object.entries(data).map(([id, item]) => ({
        id,
        ...(item as Omit<T, "id">),
      })) as T[];
    }
    return [];
  };

  return { create, update: updateItem, delete: deleteItem, subscribe, getAll };
}

// ============================================
// Concrete CRUD instances
// ============================================

const storiesCRUD = createFirebaseCRUD<Story>(
  "gallery/stories",
  (story) => {
    const urls = [story.thumbnail];
    if (story.url && story.url !== story.thumbnail) {
      urls.push(story.url);
    }
    return urls;
  },
);

const testimonialsCRUD = createFirebaseCRUD<Testimonial>(
  "gallery/testimonials",
  (testimonial) => [testimonial.avatar, testimonial.thumbnail],
);

const beforeAfterCRUD = createFirebaseCRUD<BeforeAfterProject>(
  "gallery/beforeAfter",
  (project) => [project.beforeImage, project.afterImage],
);

const liveStreamsCRUD = createFirebaseCRUD<LiveStream>(
  "gallery/liveStreams",
  (stream) => [stream.thumbnail],
);

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
