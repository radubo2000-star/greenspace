import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Leaf, Loader2, Eye } from 'lucide-react'
import { subscribeToBeforeAfterProjects, type BeforeAfterProject } from '@/services/gallery-service'
import { useBeforeAfterViews } from '@/hooks/use-firebase-metrics'
import { getImagePreview } from '@/lib/image-preview-helper'

interface BeforeAfter {
  id: string
  title: string
  location: string
  date: string
  beforeImage: string
  afterImage: string
  description: string
  stats: {
    volunteers: number
    treesPlanted?: number
    wasteCollected?: number
    area?: number
  }
}

// Component for individual project card with views tracking
const ProjectCard = ({ project, index }: { project: BeforeAfter; index: number }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const { views, incrementViews } = useBeforeAfterViews(project.id)
  const hasIncrementedRef = useRef(false)

  // Increment views only once when card is mounted
  useEffect(() => {
    if (!hasIncrementedRef.current) {
      incrementViews()
      hasIncrementedRef.current = true
    }
  }, [incrementViews, project.id])

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage)))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Before/After Slider */}
      <div
        className="relative aspect-video cursor-ew-resize select-none"
        onMouseMove={handleSliderMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Image (Background) */}
        <img
          src={getImagePreview(project.afterImage)}
          alt={`${project.title} - După`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            console.error('Failed to load after image:', project.afterImage)
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
          }}
        />

        {/* Before Image (Overlay with clip) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={getImagePreview(project.beforeImage)}
            alt={`${project.title} - Înainte`}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              console.error('Failed to load before image:', project.beforeImage)
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23ddd" width="800" height="600"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
            <div className="flex gap-1">
              <div className="w-0.5 h-6 bg-gray-400" />
              <div className="w-0.5 h-6 bg-gray-400" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          Înainte
        </div>
        <div className="absolute top-4 right-4 bg-primary-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
          După
        </div>

        {/* Views Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span>{views.toLocaleString()}</span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span>{project.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-600" />
            <span>{project.date}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {project.description}
        </p>

        {/* Stats - Only show if they exist and are greater than 0 */}
        {(project.stats.treesPlanted || project.stats.wasteCollected || project.stats.area) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {project.stats.treesPlanted && project.stats.treesPlanted > 0 && (
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <Leaf className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{project.stats.treesPlanted}</div>
                <div className="text-xs text-gray-600">Plantări</div>
              </div>
            )}

            {project.stats.wasteCollected && project.stats.wasteCollected > 0 && (
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{project.stats.wasteCollected}</div>
                <div className="text-xs text-gray-600">kg deșeuri</div>
              </div>
            )}

            {project.stats.area && project.stats.area > 0 && (
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{project.stats.area}</div>
                <div className="text-xs text-gray-600">m² curățați</div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const BeforeAfterSlider = () => {
  const [firebaseProjects, setFirebaseProjects] = useState<BeforeAfterProject[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to Firebase before/after
  useEffect(() => {
    const unsubscribe = subscribeToBeforeAfterProjects((projects) => {
      setFirebaseProjects(projects)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fallback projects (demo data)
  const fallbackProjects: BeforeAfter[] = [
    {
      id: '1',
      title: 'Ecologizare Parc Herăstrău',
      location: 'București, Sector 1',
      date: 'Martie 2024',
      beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
      afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      description: 'Transformarea unei zone degradate în spațiu verde recreațional pentru comunitate.',
      stats: {
        volunteers: 45,
        wasteCollected: 320,
        area: 2500
      }
    },
    {
      id: '2',
      title: 'Plantare Copaci - Pădurea Băneasa',
      location: 'București, Sector 1',
      date: 'Aprilie 2024',
      beforeImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
      afterImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      description: 'Reîmpădurire zonă defrișată cu 500 de puieți de stejar și fag.',
      stats: {
        volunteers: 78,
        treesPlanted: 500,
        area: 5000
      }
    },
    {
      id: '3',
      title: 'Curățare Malul Dâmboviței',
      location: 'București',
      date: 'Mai 2024',
      beforeImage: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
      afterImage: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
      description: 'Ecologizare completă a malului râului pe o distanță de 2 km.',
      stats: {
        volunteers: 62,
        wasteCollected: 450,
        area: 3000
      }
    },
    {
      id: '4',
      title: 'Grădină Comunitară Floreasca',
      location: 'București, Sector 1',
      date: 'Iunie 2024',
      beforeImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800',
      afterImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      description: 'Transformarea unui teren viran în grădină urbană comunitară.',
      stats: {
        volunteers: 34,
        treesPlanted: 25,
        area: 800
      }
    },
    {
      id: '5',
      title: 'Reabilitare Parc Tineretului',
      location: 'București, Sector 4',
      date: 'Iulie 2024',
      beforeImage: 'https://images.unsplash.com/photo-1605731414904-06d4a8e3e6a0?w=800',
      afterImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      description: 'Renovare completă a zonei de joacă și plantare arbori ornamentali.',
      stats: {
        volunteers: 56,
        treesPlanted: 80,
        area: 4000
      }
    },
    {
      id: '6',
      title: 'Ecologizare Lacul Morii',
      location: 'București, Sector 6',
      date: 'August 2024',
      beforeImage: 'https://images.unsplash.com/photo-1583486932969-8e3a3fc7c7f7?w=800',
      afterImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
      description: 'Curățare maluri lac și plantare vegetație acvatică.',
      stats: {
        volunteers: 89,
        wasteCollected: 680,
        area: 6000
      }
    }
  ]

  // Convert Firebase projects to display format
  const convertFirebaseToProject = (fb: BeforeAfterProject): BeforeAfter => ({
    id: fb.id,
    title: fb.title,
    location: fb.location,
    date: new Date(fb.date).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' }),
    beforeImage: fb.beforeImage,
    afterImage: fb.afterImage,
    description: fb.description,
    stats: {
      volunteers: fb.volunteers || 0,
      treesPlanted: fb.treesPlanted,
      wasteCollected: fb.wasteCollected,
      area: fb.area
    }
  })

  // Use Firebase projects if available, otherwise use fallback
  const displayProjects = firebaseProjects.length > 0
    ? firebaseProjects.map(convertFirebaseToProject)
    : fallbackProjects

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">Se încarcă proiectele...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {displayProjects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  )
}

export default BeforeAfterSlider
