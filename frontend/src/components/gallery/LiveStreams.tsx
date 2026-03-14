import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Calendar, MapPin, Users, Clock, Play, X, MessageCircle, Heart, Share2, Loader2 } from 'lucide-react'
import { useLiveStreamViewers } from '@/hooks/use-firebase-metrics'
import { subscribeToLiveStreams, type LiveStream as FirebaseLiveStream } from '@/services/gallery-service'
import { getImagePreview, getVideoPreview } from '@/lib/image-preview-helper'
import { getYouTubeEmbedUrl } from '@/lib/youtube-helpers'

interface LiveStream {
  id: string
  title: string
  description: string
  thumbnail: string
  streamUrl: string
  status: 'live' | 'upcoming' | 'ended'
  date: string
  time: string
  location: string
  viewers?: number
  duration?: string
  category: string
}

const LiveStreams = () => {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live')
  const [firebaseStreams, setFirebaseStreams] = useState<FirebaseLiveStream[]>([])
  const [loading, setLoading] = useState(true)

  // Subscribe to Firebase live streams
  useEffect(() => {
    const unsubscribe = subscribeToLiveStreams((streams) => {
      setFirebaseStreams(streams)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fallback streams (demo data)
  const fallbackStreams: LiveStream[] = [
    {
      id: '1',
      title: 'Plantare Copaci LIVE - Pădurea Băneasa',
      description: 'Alătură-te nouă în direct pentru cea mai mare campanie de plantare a anului! Vom planta 1000 de copaci într-o singură zi.',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
      streamUrl: 'https://www.youtube.com/embed/live_stream_id',
      status: 'live',
      date: 'Astăzi',
      time: '10:00 - 16:00',
      location: 'Pădurea Băneasa, București',
      viewers: 1234,
      category: 'Plantare'
    },
    {
      id: '2',
      title: 'Workshop Compostare Urbană',
      description: 'Învață cum să transformi deșeurile organice în compost de calitate pentru grădina ta urbană.',
      thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
      streamUrl: 'https://www.youtube.com/embed/live_stream_id',
      status: 'upcoming',
      date: '15 Decembrie 2024',
      time: '18:00 - 20:00',
      location: 'Online',
      category: 'Educație'
    },
    {
      id: '3',
      title: 'Ecologizare Malul Dâmboviței',
      description: 'Urmărește în direct acțiunea de curățare a malului râului pe o distanță de 2 km.',
      thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800',
      streamUrl: 'https://www.youtube.com/embed/live_stream_id',
      status: 'upcoming',
      date: '20 Decembrie 2024',
      time: '09:00 - 14:00',
      location: 'Malul Dâmboviței, București',
      category: 'Ecologizare'
    },
    {
      id: '4',
      title: 'Conferință: Schimbări Climatice și Acțiune Locală',
      description: 'Experți în mediu discută despre impactul schimbărilor climatice și ce putem face la nivel local.',
      thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      streamUrl: 'https://www.youtube.com/embed/live_stream_id',
      status: 'upcoming',
      date: '22 Decembrie 2024',
      time: '19:00 - 21:00',
      location: 'Online',
      category: 'Conferință'
    },
    {
      id: '5',
      title: 'Tabără Educațională Munții Apuseni - Ziua 3',
      description: 'Urmărește aventurile participanților la tabăra noastră educațională din inima munților.',
      thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      streamUrl: 'https://www.youtube.com/embed/past_stream_id',
      status: 'ended',
      date: '10 Noiembrie 2024',
      time: '10:00 - 12:00',
      location: 'Munții Apuseni',
      duration: '2h 15min',
      viewers: 3456,
      category: 'Tabără'
    },
    {
      id: '6',
      title: 'Campanie Conștientizare Plastic - Centrul Vechi',
      description: 'Acțiune de informare și colectare plastic în centrul istoric al Bucureștiului.',
      thumbnail: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800',
      streamUrl: 'https://www.youtube.com/embed/past_stream_id',
      status: 'ended',
      date: '5 Noiembrie 2024',
      time: '11:00 - 15:00',
      location: 'Centrul Vechi, București',
      duration: '4h',
      viewers: 2890,
      category: 'Campanie'
    }
  ]

  // Convert Firebase streams to display format
  const convertFirebaseToStream = (fb: FirebaseLiveStream): LiveStream => {
    // Determine status based on isLive and scheduledTime
    let status: 'live' | 'upcoming' | 'ended' = 'upcoming'
    
    if (fb.isLive) {
      // If manually marked as live, keep it live
      status = 'live'
    } else if (fb.scheduledTime) {
      const scheduledDate = new Date(fb.scheduledTime)
      const now = new Date()
      
      // Stream duration: use custom duration or default to 3 hours
      const streamDurationHours = fb.durationHours || 3
      const streamEndTime = new Date(scheduledDate.getTime() + streamDurationHours * 60 * 60 * 1000)
      
      if (now < scheduledDate) {
        // Stream hasn't started yet
        status = 'upcoming'
      } else if (now >= scheduledDate && now <= streamEndTime) {
        // Stream is currently happening (within the 3-hour window)
        status = 'live'
      } else {
        // Stream has ended (more than 3 hours after scheduled time)
        status = 'ended'
      }
    }

    // Format date and time
    const scheduledDate = fb.scheduledTime ? new Date(fb.scheduledTime) : new Date()
    const dateStr = scheduledDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
    const timeStr = scheduledDate.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })

    return {
      id: fb.id,
      title: fb.title,
      description: fb.description,
      thumbnail: fb.thumbnail,
      streamUrl: fb.streamUrl,
      status: status,
      date: dateStr,
      time: timeStr,
      location: 'Online', // Default location
      viewers: fb.viewers || 0,
      duration: undefined,
      category: 'Live Stream'
    }
  }

  // Use Firebase streams if available, otherwise use fallback
  const allStreams = firebaseStreams.length > 0
    ? firebaseStreams.map(convertFirebaseToStream)
    : fallbackStreams

  const filteredStreams = allStreams.filter(stream => {
    if (activeTab === 'live') return stream.status === 'live'
    if (activeTab === 'upcoming') return stream.status === 'upcoming'
    if (activeTab === 'past') return stream.status === 'ended'
    return true
  })

  // Component pentru fiecare stream cu Firebase
  const StreamCard = ({ stream, index }: { stream: LiveStream; index: number }) => {
    const { viewers, join, leave: _leave } = useLiveStreamViewers(stream.id)

    const handleStreamClick = () => {
      if (stream.status === 'live') {
        join()
      }
      setSelectedStream(stream)
    }

    return (
      <motion.div
        key={stream.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
        onClick={handleStreamClick}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video group">
          <img
            src={getImagePreview(stream.thumbnail)}
            alt={stream.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              console.error('Failed to load stream thumbnail:', stream.thumbnail)
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23ddd" width="800" height="450"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
            }}
          />
          
          {/* Status Badge */}
          {stream.status === 'live' && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span>LIVE</span>
            </div>
          )}

          {stream.status === 'upcoming' && (
            <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Programat
            </div>
          )}

          {/* Viewers/Duration Badge - Firebase Real-time */}
          {stream.status === 'live' && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{(viewers ?? stream.viewers ?? 0).toLocaleString()}</span>
            </div>
          )}

          {stream.status === 'ended' && stream.duration && (
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {stream.duration}
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <div className="inline-block bg-green-50 text-primary-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
            {stream.category}
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
            {stream.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {stream.description}
          </p>

          {/* Info */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span>{stream.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" />
              <span>{stream.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>{stream.location}</span>
            </div>
          </div>

          {/* CTA */}
          <button className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            stream.status === 'live'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : stream.status === 'upcoming'
              ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            {stream.status === 'live' && (
              <>
                <Radio className="w-4 h-4" />
                <span>Urmărește Live</span>
              </>
            )}
            {stream.status === 'upcoming' && (
              <>
                <Calendar className="w-4 h-4" />
                <span>Setează Reminder</span>
              </>
            )}
            {stream.status === 'ended' && (
              <>
                <Play className="w-4 h-4" />
                <span>Vizionează Înregistrarea</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-3 text-gray-600">Se încarcă transmisiunile...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('live')}
          className={`pb-4 px-6 font-semibold transition-colors relative ${
            activeTab === 'live'
              ? 'text-red-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Radio className={`w-5 h-5 ${activeTab === 'live' ? 'animate-pulse' : ''}`} />
            <span>Live Acum</span>
            {allStreams.filter(s => s.status === 'live').length > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {allStreams.filter(s => s.status === 'live').length}
              </span>
            )}
          </div>
          {activeTab === 'live' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-4 px-6 font-semibold transition-colors relative ${
            activeTab === 'upcoming'
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Programate</span>
          </div>
          {activeTab === 'upcoming' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`pb-4 px-6 font-semibold transition-colors relative ${
            activeTab === 'past'
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            <span>Înregistrări</span>
          </div>
          {activeTab === 'past' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
            />
          )}
        </button>
      </div>

      {/* Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStreams.map((stream, index) => (
          <StreamCard key={stream.id} stream={stream} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredStreams.length === 0 && (
        <div className="text-center py-16">
          <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {activeTab === 'live' && 'Niciun stream live în acest moment'}
            {activeTab === 'upcoming' && 'Niciun stream programat'}
            {activeTab === 'past' && 'Nicio înregistrare disponibilă'}
          </h3>
          <p className="text-gray-600">
            Revino mai târziu pentru a vedea streamurile noastre!
          </p>
        </div>
      )}

      {/* Stream Viewer Modal */}
      <AnimatePresence>
        {selectedStream && <StreamModal stream={selectedStream} onClose={() => setSelectedStream(null)} />}
      </AnimatePresence>
    </div>
  )
}

// Modal component cu Firebase
const StreamModal = ({ stream, onClose }: { stream: LiveStream; onClose: () => void }) => {
  const { viewers } = useLiveStreamViewers(stream.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {stream.status === 'live' && (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span>LIVE</span>
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {stream.title}
            </h2>
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
          {(() => {
            // Check if it's a YouTube URL
            const embedUrl = getYouTubeEmbedUrl(stream.streamUrl)
            
            if (embedUrl && embedUrl !== stream.streamUrl) {
              // YouTube video
              return (
                <iframe
                  src={embedUrl}
                  title={stream.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )
            } else {
              // Local video file or other video URL
              const videoSrc = getVideoPreview(stream.streamUrl)
              return (
                <video
                  src={videoSrc}
                  className="w-full h-full"
                  controls
                  autoPlay
                  onError={(_e) => {
                    console.error('Failed to load video:', stream.streamUrl)
                  }}
                />
              )
            }
          })()}
        </div>

        {/* Details */}
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            {stream.description}
          </p>

          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span>{stream.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-600" />
              <span>{stream.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span>{stream.location}</span>
            </div>
            {stream.status === 'live' && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                <span>{(viewers ?? stream.viewers ?? 0).toLocaleString()} spectatori</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              <span>Apreciază</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Comentează</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Distribuie</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LiveStreams
