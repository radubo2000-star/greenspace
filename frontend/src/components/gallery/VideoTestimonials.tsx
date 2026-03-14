import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X, Heart, MessageCircle, Share2, Loader2 } from 'lucide-react'
import { useTestimonialLikes, useTestimonialComments } from '@/hooks/use-firebase-metrics'
import { subscribeToTestimonials, type Testimonial as FirebaseTestimonial } from '@/services/gallery-service'
import { getImagePreview } from '@/lib/image-preview-helper'
import { getVideoDuration } from '@/utils/youtube-duration'
import { extractYouTubeId, getYouTubeEmbedUrl } from '@/lib/youtube-helpers'

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  thumbnail: string
  videoUrl: string
  title: string
  description: string
  duration: string
  likes: number
  comments: number
  date: string
}


const VideoTestimonials = () => {
  const [selectedVideo, setSelectedVideo] = useState<Testimonial | null>(null)
  const [firebaseTestimonials, setFirebaseTestimonials] = useState<FirebaseTestimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to Firebase testimonials
  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((testimonials) => {
      setFirebaseTestimonials(testimonials)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fallback testimonials (demo data)
  const fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Maria Popescu',
      role: 'Voluntar activ - 2 ani',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'De ce am devenit voluntar la Green Space',
      description: 'Povestea mea despre cum am descoperit pasiunea pentru protecția mediului și cum Green Space mi-a schimbat viața.',
      duration: '3:45',
      likes: 234,
      comments: 45,
      date: 'Acum 2 zile'
    },
    {
      id: '2',
      name: 'Andrei Ionescu',
      role: 'Coordonator proiect',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Impactul ecologizărilor asupra comunității',
      description: 'Cum am reușit să transformăm o zonă degradată într-un spațiu verde pentru comunitate.',
      duration: '5:12',
      likes: 456,
      comments: 78,
      date: 'Acum 5 zile'
    },
    {
      id: '3',
      name: 'Elena Dumitrescu',
      role: 'Voluntar nou',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Prima mea experiență la tabăra educațională',
      description: 'Ce am învățat în prima mea tabără și de ce recomand tuturor să participe.',
      duration: '4:20',
      likes: 189,
      comments: 32,
      date: 'Acum 1 săptămână'
    },
    {
      id: '4',
      name: 'Mihai Georgescu',
      role: 'Voluntar - 3 ani',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      thumbnail: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Cum am plantat 1000 de copaci într-o zi',
      description: 'Experiența incredibilă de la cea mai mare campanie de plantare a anului.',
      duration: '6:30',
      likes: 678,
      comments: 123,
      date: 'Acum 2 săptămâni'
    },
    {
      id: '5',
      name: 'Ana Marinescu',
      role: 'Educator ambiental',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
      thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Educația ecologică în școli',
      description: 'Cum reușim să inspirăm copiii să devină protectori ai mediului.',
      duration: '4:55',
      likes: 345,
      comments: 67,
      date: 'Acum 3 săptămâni'
    },
    {
      id: '6',
      name: 'Cristian Popa',
      role: 'Voluntar corporativ',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      title: 'Team building cu impact real',
      description: 'Cum am convins compania să se implice în proiecte de mediu.',
      duration: '3:30',
      likes: 512,
      comments: 89,
      date: 'Acum 1 lună'
    }
  ]

  // Convert Firebase testimonials to display format
  const convertFirebaseToTestimonial = (fb: FirebaseTestimonial): Testimonial => ({
    id: fb.id,
    name: fb.name,
    role: fb.role,
    avatar: fb.avatar,
    thumbnail: fb.thumbnail,
    videoUrl: getYouTubeEmbedUrl(fb.videoUrl), // Convert to embed URL
    title: fb.title || 'Testimonial',
    description: fb.description || '',
    duration: fb.duration || '0:00',
    likes: 0,
    comments: 0,
    date: fb.createdAt 
      ? new Date(fb.createdAt).toLocaleDateString('ro-RO')
      : new Date(fb.timestamp).toLocaleDateString('ro-RO')
  })

  // Use Firebase testimonials if available, otherwise use fallback
  const displayTestimonials = firebaseTestimonials.length > 0
    ? firebaseTestimonials.map(convertFirebaseToTestimonial)
    : fallbackTestimonials

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">Se încarcă testimonialele...</span>
      </div>
    )
  }

  // Component pentru fiecare testimonial cu Firebase
  const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
    const { likes, isLiked, toggleLike } = useTestimonialLikes(testimonial.id)
    const { comments } = useTestimonialComments(testimonial.id)
    const [duration, setDuration] = useState<string>('0:00')

    // Calculate duration from YouTube video (always recalculate, ignore old value from Firebase)
    useEffect(() => {
      const videoId = extractYouTubeId(testimonial.videoUrl)
      console.log('🎬 Testimonial:', testimonial.name)
      console.log('📹 Video URL:', testimonial.videoUrl)
      console.log('🆔 Extracted Video ID:', videoId)
      
      if (videoId) {
        console.log('⏳ Calculating duration for:', videoId)
        getVideoDuration(videoId).then((calculatedDuration) => {
          console.log('✅ Duration calculated:', calculatedDuration)
          if (calculatedDuration) {
            setDuration(calculatedDuration)
          }
        }).catch((error) => {
          console.error('❌ Error calculating duration:', error)
        })
      } else {
        console.warn('⚠️ No video ID extracted from URL:', testimonial.videoUrl)
      }
    }, [testimonial.videoUrl])

    const handleShare = async () => {
      const shareData = {
        title: testimonial.title,
        text: `${testimonial.description} - ${testimonial.name}`,
        url: window.location.href
      }

      try {
        if (navigator.share) {
          await navigator.share(shareData)
        } else {
          // Fallback: copiază link-ul în clipboard
          await navigator.clipboard.writeText(window.location.href)
          alert('Link copiat în clipboard!')
        }
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }

    return (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* Video Thumbnail */}
            <div
              className="relative aspect-video cursor-pointer group"
              onClick={() => setSelectedVideo(testimonial)}
            >
              <img
                src={getImagePreview(testimonial.thumbnail)}
                alt={testimonial.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                onError={(e) => {
                  console.error('Failed to load testimonial thumbnail:', testimonial.thumbnail)
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EVideo%3C/text%3E%3C/svg%3E'
                }}
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                </div>
              </div>
              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-sm px-2 py-1 rounded">
                {duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-5">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={getImagePreview(testimonial.avatar)}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load testimonial avatar:', testimonial.avatar)
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle fill="%23ddd" cx="25" cy="25" r="25"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>

              {/* Title */}
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {testimonial.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {testimonial.description}
              </p>

              {/* Actions - Firebase Real-time */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike()
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  <span className="text-sm font-medium">
                    {likes ?? testimonial.likes}
                  </span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedVideo(testimonial)
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{comments ?? testimonial.comments}</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShare()
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-3">{testimonial.date}</p>
            </div>
          </motion.div>
    )
  }

  return (
    <div>
      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayTestimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
    </div>
  )
}

// Modal component cu Firebase
const VideoModal = ({ video, onClose }: { video: Testimonial; onClose: () => void }) => {
  const { likes, isLiked, toggleLike } = useTestimonialLikes(video.id)
  const { comments, commentsList, addComment } = useTestimonialComments(video.id)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: video.title,
      text: `${video.description} - ${video.name}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copiază link-ul în clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copiat în clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await addComment(newComment.trim())
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Eroare la adăugarea comentariului')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <img
                    src={getImagePreview(video.avatar)}
                    alt={video.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load video avatar:', video.avatar)
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle fill="%23ddd" cx="25" cy="25" r="25"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em\"%3E?%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{video.name}</h3>
                    <p className="text-sm text-gray-500">{video.role}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {video.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {video.description}
                </p>

                {/* Actions - Firebase Real-time */}
                <div className="flex items-center gap-6 pb-4 border-b">
                  <button
                    onClick={toggleLike}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart
                      className={`w-6 h-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span className="font-medium">
                      {likes ?? video.likes} aprecieri
                    </span>
                  </button>
                  <button 
                    onClick={() => setShowComments(!showComments)}
                    className={`flex items-center gap-2 transition-colors ${
                      showComments ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
                    }`}
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium">{comments ?? video.comments} comentarii</span>
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                    <span className="font-medium">Distribuie</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showComments && (
                  <div className="mt-4">
                    {/* Add Comment Form */}
                    <form onSubmit={handleSubmitComment} className="mb-4">
                      <div className="flex gap-3">
                        <img
                          src="https://ui-avatars.com/api/?name=User&background=10b981&color=fff"
                          alt="Your avatar"
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Adaugă un comentariu..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                            rows={3}
                            disabled={isSubmitting}
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              type="submit"
                              disabled={!newComment.trim() || isSubmitting}
                              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                              {isSubmitting ? 'Se trimite...' : 'Comentează'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {commentsList.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Fii primul care comentează!</p>
                        </div>
                      ) : (
                        commentsList.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <img
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.userName)}&background=10b981&color=fff`}
                              alt={comment.userName}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <p className="font-semibold text-sm text-gray-900">{comment.userName}</p>
                                <p className="text-gray-700 mt-1">{comment.text}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 ml-4">
                                {new Date(comment.timestamp).toLocaleDateString('ro-RO', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
  )
}

export default VideoTestimonials
