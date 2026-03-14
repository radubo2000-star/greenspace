/**
 * Script pentru popularea testimonialelor în Firebase
 * Rulează acest script pentru a adăuga testimoniale demo în galerie
 */

import { createTestimonial } from '@/services/gallery-service'

const testimonialsSeedData = [
  {
    name: 'Maria Popescu',
    role: 'Voluntar activ - 2 ani',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    title: 'De ce am devenit voluntar la Green Space',
    description: 'Povestea mea despre cum am descoperit pasiunea pentru protecția mediului și cum Green Space mi-a schimbat viața.',
    duration: '3:45',
    rating: 5
  },
  {
    name: 'Andrei Ionescu',
    role: 'Coordonator proiect',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    title: 'Impactul ecologizărilor asupra comunității',
    description: 'Cum am reușit să transformăm o zonă degradată într-un spațiu verde pentru comunitate.',
    duration: '5:12',
    rating: 5
  },
  {
    name: 'Elena Dumitrescu',
    role: 'Voluntar nou',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    title: 'Prima mea experiență la tabăra educațională',
    description: 'Ce am învățat în prima mea tabără și de ce recomand tuturor să participe.',
    duration: '4:20',
    rating: 5
  },
  {
    name: 'Mihai Georgescu',
    role: 'Voluntar - 3 ani',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    title: 'Cum am plantat 1000 de copaci într-o zi',
    description: 'Experiența incredibilă de la cea mai mare campanie de plantare a anului.',
    duration: '6:30',
    rating: 5
  },
  {
    name: 'Ana Marinescu',
    role: 'Educator ambiental',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    title: 'Educația ecologică în școli',
    description: 'Cum reușim să inspirăm copiii să devină protectori ai mediului.',
    duration: '4:55',
    rating: 5
  },
  {
    name: 'Cristian Popa',
    role: 'Voluntar corporativ',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    title: 'Team building cu impact real',
    description: 'Cum am convins compania să se implice în proiecte de mediu.',
    duration: '3:30',
    rating: 5
  }
]

export const seedTestimonials = async (): Promise<void> => {
  console.log('🔄 Populare testimoniale în Firebase...')
  
  try {
    for (const testimonial of testimonialsSeedData) {
      const id = await createTestimonial({ ...testimonial, timestamp: Date.now() })
      console.log(`✅ Testimonial "${testimonial.title}" creat cu ID: ${id}`)
    }
    
    console.log('✅ Toate testimonialele au fost create cu succes!')
  } catch (error) {
    console.error('❌ Eroare la popularea testimonialelor:', error)
    throw error
  }
}
