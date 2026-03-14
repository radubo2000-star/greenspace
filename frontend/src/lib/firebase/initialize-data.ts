/**
 * Script pentru inițializarea datelor în Firebase
 * Rulează acest script o singură dată pentru a popula Firebase cu datele inițiale
 */

import { ref, set, get } from 'firebase/database'
import { database } from './config'

// Date inițiale pentru Stories
const storiesInitialData = [
  { id: 1, views: 1234 },
  { id: 2, views: 987 },
  { id: 3, views: 2156 },
  { id: 4, views: 1567 },
  { id: 5, views: 3421 },
  { id: 6, views: 1890 }
]

// Date inițiale pentru Testimonials
const testimonialsInitialData = [
  { id: 1, likes: 234, comments: 45 },
  { id: 2, likes: 456, comments: 78 },
  { id: 3, likes: 189, comments: 32 },
  { id: 4, likes: 678, comments: 123 },
  { id: 5, likes: 345, comments: 67 },
  { id: 6, likes: 523, comments: 89 }
]

// Date inițiale pentru Live Streams
const liveStreamsInitialData = [
  { id: 1, viewers: 156 },
  { id: 2, viewers: 89 },
  { id: 3, viewers: 234 }
]

// Date inițiale pentru Projects (Before/After)
const projectsInitialData = [
  {
    id: 1,
    stats: {
      volunteers: 45,
      wasteCollected: 320,
      area: 2500
    }
  },
  {
    id: 2,
    stats: {
      volunteers: 78,
      treesPlanted: 500,
      area: 5000
    }
  },
  {
    id: 3,
    stats: {
      volunteers: 62,
      wasteCollected: 450,
      area: 3000
    }
  },
  {
    id: 4,
    stats: {
      volunteers: 34,
      treesPlanted: 25,
      area: 800
    }
  },
  {
    id: 5,
    stats: {
      volunteers: 56,
      treesPlanted: 80,
      area: 4000
    }
  },
  {
    id: 6,
    stats: {
      volunteers: 71,
      wasteCollected: 580,
      area: 6000
    }
  }
]

/**
 * Inițializează Stories în Firebase
 */
export const initializeStories = async (): Promise<void> => {
  console.log('🔄 Inițializare Stories...')
  
  for (const story of storiesInitialData) {
    const storyRef = ref(database, `stories/${story.id}`)
    const snapshot = await get(storyRef)
    
    if (!snapshot.exists()) {
      await set(storyRef, {
        views: story.views,
        createdAt: Date.now()
      })
      console.log(`✅ Story ${story.id} inițializat cu ${story.views} views`)
    } else {
      console.log(`⏭️  Story ${story.id} există deja`)
    }
  }
  
  console.log('✅ Stories inițializate cu succes!')
}

/**
 * Inițializează Testimonials în Firebase
 */
export const initializeTestimonials = async (): Promise<void> => {
  console.log('🔄 Inițializare Testimonials...')
  
  for (const testimonial of testimonialsInitialData) {
    const testimonialRef = ref(database, `testimonials/${testimonial.id}`)
    const snapshot = await get(testimonialRef)
    
    if (!snapshot.exists()) {
      await set(testimonialRef, {
        likesCount: testimonial.likes,
        commentsCount: testimonial.comments,
        likes: {},
        createdAt: Date.now()
      })
      console.log(`✅ Testimonial ${testimonial.id} inițializat cu ${testimonial.likes} likes, ${testimonial.comments} comments`)
    } else {
      console.log(`⏭️  Testimonial ${testimonial.id} există deja`)
    }
  }
  
  console.log('✅ Testimonials inițializate cu succes!')
}

/**
 * Inițializează Live Streams în Firebase
 */
export const initializeLiveStreams = async (): Promise<void> => {
  console.log('🔄 Inițializare Live Streams...')
  
  for (const stream of liveStreamsInitialData) {
    const streamRef = ref(database, `livestreams/${stream.id}`)
    const snapshot = await get(streamRef)
    
    if (!snapshot.exists()) {
      await set(streamRef, {
        viewersCount: stream.viewers,
        viewers: {},
        createdAt: Date.now()
      })
      console.log(`✅ Live Stream ${stream.id} inițializat cu ${stream.viewers} viewers`)
    } else {
      console.log(`⏭️  Live Stream ${stream.id} există deja`)
    }
  }
  
  console.log('✅ Live Streams inițializate cu succes!')
}

/**
 * Inițializează Projects în Firebase
 */
export const initializeProjects = async (): Promise<void> => {
  console.log('🔄 Inițializare Projects...')
  
  for (const project of projectsInitialData) {
    const projectRef = ref(database, `projects/${project.id}`)
    const snapshot = await get(projectRef)
    
    if (!snapshot.exists()) {
      await set(projectRef, {
        stats: project.stats,
        createdAt: Date.now()
      })
      console.log(`✅ Project ${project.id} inițializat`, project.stats)
    } else {
      console.log(`⏭️  Project ${project.id} există deja`)
    }
  }
  
  console.log('✅ Projects inițializate cu succes!')
}

/**
 * Inițializează toate datele în Firebase
 */
export const initializeAllData = async (): Promise<void> => {
  console.log('🚀 Începe inițializarea datelor în Firebase...\n')
  
  try {
    await initializeStories()
    console.log('')
    
    await initializeTestimonials()
    console.log('')
    
    await initializeLiveStreams()
    console.log('')
    
    await initializeProjects()
    console.log('')
    
    console.log('🎉 Toate datele au fost inițializate cu succes!')
    console.log('📊 Verifică Firebase Console pentru a vedea datele: https://console.firebase.google.com/')
  } catch (error) {
    console.error('❌ Eroare la inițializarea datelor:', error)
    throw error
  }
}

/**
 * Resetează toate datele (ATENȚIE: Șterge tot!)
 */
export const resetAllData = async (): Promise<void> => {
  console.log('⚠️  ATENȚIE: Resetare date...')
  
  const rootRef = ref(database)
  await set(rootRef, null)
  
  console.log('✅ Toate datele au fost șterse!')
}
