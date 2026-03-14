import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Loader2, Eye } from 'lucide-react'
import { subscribeToStories, type Story } from '@/services/gallery-service'
import { useStoryViews } from '@/hooks/use-firebase-metrics'
import { getImagePreview, getVideoPreview } from '@/lib/image-preview-helper'
import { getYouTubeEmbedUrl, isYouTubeUrl } from '@/lib/youtube-helpers'

const getYouTubeStoryEmbedUrl = (url: string): string | null => {
  if (!url || !isYouTubeUrl(url)) return null

  const embedUrl = getYouTubeEmbedUrl(url)
  if (!embedUrl) return null

  return `${embedUrl}?autoplay=1&mute=0&controls=1&rel=0`
}

// Component to increment views when story is opened in modal
const StoryViewsIncrementer = ({ storyId }: { storyId: string }) => {
  const { incrementViews } = useStoryViews(storyId)
  const hasIncrementedRef = useRef(false)

  useEffect(() => {
    if (!hasIncrementedRef.current) {
      incrementViews()
      hasIncrementedRef.current = true
    }
  }, [incrementViews, storyId])

  return null
}

// Component for Story Card with Firebase views
const StoryCard = ({ story, index, onClick }: { story: Story; index: number; onClick: () => void }) => {
  const { views } = useStoryViews(story.id)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Story Thumbnail */}
      <div className="relative aspect-[9/16] rounded-2xl overflow-hidden">
        <img
          src={getImagePreview(story.thumbnail)}
          alt={story.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
          onError={(e) => {
            console.warn('Failed to load story thumbnail, using fallback:', story.thumbnail)
            // Use a nice gradient fallback instead of a plain SVG
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2310b981;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23059669;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="600"/%3E%3Ctext fill="white" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="20" font-family="Arial"%3E%F0%9F%8C%B1 Green Space%3C/text%3E%3C/svg%3E'
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Play Icon for Videos */}
        {story.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary-600 fill-primary-600" />
            </div>
          </div>
        )}
        
        {/* Story Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
            {story.title}
          </h3>
          <p className="text-white/80 text-xs">{story.date}</p>
        </div>

        {/* Ring Border */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-primary-500 ring-offset-2 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Views Badge with Firebase */}
      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
        <Eye className="w-3 h-3" />
        <span>{views.toLocaleString()}</span>
      </div>
    </motion.div>
  )
}

const Stories = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)

  // Load stories from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToStories((data) => {
      setStories(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Fallback stories for demo
  const fallbackStories: Story[] = [
    {
      id: '1',
      title: 'Plantare Copaci - Pădurea Băneasa',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
      type: 'image',
      description: 'Peste 100 de voluntari au plantat copaci în Pădurea Băneasa',
      location: 'Pădurea Băneasa, București',
      date: '2024-03-15',
      timestamp: Date.now()
    },
    {
      id: '2',
      title: 'Ecologizare Râul Dâmbovița',
      url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400',
      type: 'image',
      description: 'Campanie de curățare a râului Dâmbovița',
      location: 'Râul Dâmbovița, București',
      date: '2024-03-12',
      timestamp: Date.now()
    },
    {
      id: '3',
      title: 'Tabără Educațională Munții Apuseni',
      url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
      type: 'image',
      description: 'Tabără educațională pentru tineri în Munții Apuseni',
      location: 'Munții Apuseni',
      date: '2024-03-10',
      timestamp: Date.now()
    },
    {
      id: '4',
      title: 'Workshop Reciclare Creativă',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
      type: 'image',
      description: 'Workshop de reciclare creativă pentru copii',
      location: 'București',
      date: '2024-03-08',
      timestamp: Date.now()
    },
    {
      id: '5',
      title: 'Campanie Conștientizare Plastic',
      url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
      type: 'image',
      description: 'Campanie de conștientizare despre poluarea cu plastic',
      location: 'București',
      date: '2024-03-08',
      timestamp: Date.now()
    },
    {
      id: '6',
      title: 'Grădinițe Urbane Comunitare',
      url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200',
      thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      type: 'image',
      description: 'Crearea de grădinițe urbane comunitare',
      location: 'București',
      date: '2024-03-01',
      timestamp: Date.now()
    }
  ]

  // Use Firebase stories or fallback
  const displayStories = stories.length > 0 ? stories : fallbackStories

  const openStory = (story: Story, index: number) => {
    setSelectedStory(story)
    setCurrentIndex(index)
    setProgress(0)
    setIsPlaying(true)
    // Increment views will be handled in the modal
  }

  const closeStory = () => {
    setSelectedStory(null)
    setProgress(0)
  }

  const nextStory = () => {
    if (currentIndex < displayStories.length - 1) {
      const nextIndex = currentIndex + 1
      setSelectedStory(displayStories[nextIndex])
      setCurrentIndex(nextIndex)
      setProgress(0)
    } else {
      closeStory()
    }
  }

  const prevStory = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setSelectedStory(displayStories[prevIndex])
      setCurrentIndex(prevIndex)
      setProgress(0)
    }
  }

  // Auto-progress for stories
  useEffect(() => {
    if (selectedStory && isPlaying) {
      const duration = 5 // 5 seconds per story
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextStory()
            return 0
          }
          return prev + (100 / (duration * 10))
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [selectedStory, isPlaying])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div>
      {/* Stories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayStories.map((story, index) => (
          <StoryCard 
            key={story.id} 
            story={story} 
            index={index} 
            onClick={() => openStory(story, index)}
          />
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Increment views when story is opened */}
            <StoryViewsIncrementer storyId={selectedStory.id} />
            
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 flex gap-1 p-4 z-10">
              {displayStories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{
                      width: index === currentIndex ? `${progress}%` : index < currentIndex ? '100%' : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                  GS
                </div>
                <div>
                  <h3 className="text-white font-semibold">{selectedStory.title}</h3>
                  <p className="text-white/70 text-sm">{selectedStory.date}</p>
                </div>
              </div>
              <button
                onClick={closeStory}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Story Content */}
            <div className="relative w-full max-w-md h-full flex items-center justify-center">
              {selectedStory.type === 'video' ? (
                (() => {
                  // Check if it's a YouTube URL
                  const embedUrl = getYouTubeStoryEmbedUrl(selectedStory.url)
                  
                  if (embedUrl) {
                    // YouTube video
                    return (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedStory.title}
                      />
                    )
                  } else {
                    // Local video file or other video URL
                    const videoSrc = getVideoPreview(selectedStory.url)
                    return (
                      <video
                        src={videoSrc}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                        muted={isMuted}
                        onError={(_e) => {
                          console.error('Failed to load video:', selectedStory.url)
                        }}
                      />
                    )
                  }
                })()
              ) : (
                <img
                  src={getImagePreview(selectedStory.url)}
                  alt={selectedStory.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.warn('Failed to load story image, using fallback:', selectedStory.url)
                    // Use a nice gradient fallback
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2310b981;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23059669;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="600"/%3E%3Ctext fill="white" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="24" font-family="Arial"%3E%F0%9F%8C%B1 Green Space%3C/text%3E%3Ctext fill="white" x="50%25" y="60%25" text-anchor="middle" dy=".3em" font-size="14" font-family="Arial"%3EImage not available%3C/text%3E%3C/svg%3E'
                  }}
                />
              )}

              {/* Navigation Areas */}
              <div className="absolute inset-0 flex">
                <button
                  onClick={prevStory}
                  className="flex-1 cursor-pointer"
                  disabled={currentIndex === 0}
                />
                <button
                  onClick={nextStory}
                  className="flex-1 cursor-pointer"
                />
              </div>

              {/* Navigation Buttons */}
              {currentIndex > 0 && (
                <button
                  onClick={prevStory}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {currentIndex < stories.length - 1 && (
                <button
                  onClick={nextStory}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Stories
