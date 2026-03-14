import { ref, set } from 'firebase/database'
import { database } from './config'
import { subscribeToTestimonials } from '@/services/gallery-service'

/**
 * Inițializează metrici (likes, comments) pentru toate testimonialele din Firebase
 */
export const initializeTestimonialMetrics = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = subscribeToTestimonials(async (testimonials) => {
      try {
        console.log(`🔄 Inițializare metrici pentru ${testimonials.length} testimoniale...`)

        for (const testimonial of testimonials) {
          const metricsRef = ref(database, `testimonials/${testimonial.id}`)
          
          // Inițializează metrici doar dacă nu există deja
          await set(metricsRef, {
            likesCount: 0,
            commentsCount: 0,
            likes: {}
          })

          console.log(`✅ Metrici inițializate pentru testimonial: ${testimonial.id}`)
        }

        console.log('✅ Toate metricile au fost inițializate cu succes!')
        unsubscribe()
        resolve()
      } catch (error) {
        console.error('❌ Eroare la inițializarea metricilor:', error)
        unsubscribe()
        reject(error)
      }
    })
  })
}
