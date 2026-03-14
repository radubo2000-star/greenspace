import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Calendar, Users, X, Loader2, Radio } from 'lucide-react'
import { 
  subscribeToLiveStreams,
  createLiveStream,
  updateLiveStream,
  deleteLiveStream,
  type LiveStream 
} from '@/services/gallery-service'
import ImageSelector from '@/components/admin/ImageSelector'
import MediaSelector from '@/components/admin/MediaSelector'
import { getImagePreview } from '@/lib/image-preview-helper'
import { getYouTubeEmbedUrl, getYouTubeThumbnail, isYouTubeUrl } from '@/lib/youtube-helpers'
import { getThumbnailUrlFromVideoUrl, isLocalVideoUrl } from '@/lib/video-thumbnail-generator'

const LiveStreamsAdminFirebase = () => {
  const [streams, setStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStream, setEditingStream] = useState<LiveStream | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    streamUrl: '',
    isLive: false,
    scheduledTime: '',
    viewers: 0,
    durationHours: 2 // Default: 2 ore
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToLiveStreams((data) => {
      setStreams(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Convert YouTube URL to embed format before saving
      const dataToSave = {
        ...formData,
        streamUrl: getYouTubeEmbedUrl(formData.streamUrl)
      }

      if (editingStream) {
        await updateLiveStream(editingStream.id, dataToSave)
      } else {
        await createLiveStream({ ...dataToSave, timestamp: Date.now() })
      }
      
      setIsFormOpen(false)
      setEditingStream(null)
      resetForm()
    } catch (err) {
      setError('Eroare la salvare')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (stream: LiveStream) => {
    setEditingStream(stream)
    setFormData({
      title: stream.title,
      description: stream.description,
      thumbnail: stream.thumbnail,
      streamUrl: stream.streamUrl,
      isLive: stream.isLive,
      scheduledTime: stream.scheduledTime || '',
      viewers: stream.viewers,
      durationHours: stream.durationHours || 2
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest live stream?')) return
    try {
      await deleteLiveStream(id)
    } catch (err) {
      setError('Eroare la ștergere')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      streamUrl: '',
      isLive: false,
      scheduledTime: '',
      viewers: 0,
      durationHours: 2
    })
  }

  // Handler pentru auto-generare thumbnail
  const handleAutoGenerateThumbnail = () => {
    if (!formData.streamUrl) return

    let thumbnail = ''
    if (isYouTubeUrl(formData.streamUrl)) {
      thumbnail = getYouTubeThumbnail(formData.streamUrl)
    } else if (isLocalVideoUrl(formData.streamUrl)) {
      thumbnail = getThumbnailUrlFromVideoUrl(formData.streamUrl)
    }

    setFormData({ ...formData, thumbnail: thumbnail || formData.streamUrl })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Streams</h2>
          <p className="text-gray-600 mt-1">{streams.length} streams în total</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adaugă Live Stream
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {streams.map((stream) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={getImagePreview(stream.thumbnail)} 
                  alt={stream.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Failed to load stream thumbnail:', stream.thumbnail)
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                  }}
                />
                {stream.isLive && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3" />
                    LIVE
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{stream.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{stream.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  {stream.scheduledTime && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(stream.scheduledTime).toLocaleString('ro-RO')}
                      {stream.durationHours && (
                        <span className="text-xs text-gray-500">
                          ({stream.durationHours}h)
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {stream.viewers}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(stream)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(stream.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Șterge
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {streams.length === 0 && (
        <div className="text-center py-12">
          <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Niciun live stream adăugat</h3>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adaugă Live Stream
          </button>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setIsFormOpen(false);
                setEditingStream(null);
                resetForm();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingStream ? 'Editează Live Stream' : 'Adaugă Live Stream Nou'}
                </h3>
                <button
                  onClick={() => { setIsFormOpen(false); setEditingStream(null); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titlu *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Plantare Copaci - Live"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descriere *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descriere..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <ImageSelector
                    value={formData.thumbnail}
                    onChange={(value) => setFormData({ ...formData, thumbnail: value })}
                    label="Thumbnail"
                    placeholder="Selectează imagine sau introdu URL"
                    required
                  />
                  {formData.streamUrl && (
                    <button
                      type="button"
                      onClick={handleAutoGenerateThumbnail}
                      className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                    >
                      Auto-generează din stream
                    </button>
                  )}
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <img 
                        src={getImagePreview(formData.thumbnail)} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Failed to load thumbnail preview:', formData.thumbnail)
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                  )}
                </div>

                <MediaSelector
                  value={formData.streamUrl}
                  onChange={(value) => {
                    // Auto-generate thumbnail when stream URL changes
                    let autoThumbnail = ''
                    
                    if (isYouTubeUrl(value)) {
                      autoThumbnail = getYouTubeThumbnail(value)
                    } else if (isLocalVideoUrl(value)) {
                      autoThumbnail = getThumbnailUrlFromVideoUrl(value)
                    }
                    
                    setFormData({ ...formData, streamUrl: value, thumbnail: autoThumbnail })
                  }}
                  label="URL Stream *"
                  placeholder="Selectează video local sau introdu URL YouTube"
                  acceptedTypes={['video']}
                />

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isLive}
                      onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Stream este LIVE acum</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Programată (opțional)</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durată Stream (ore)
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="24"
                    step="0.5"
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: parseFloat(e.target.value) || 2 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Stream-ul va rămâne activ pentru această durată după ora programată (default: 2 ore)
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsFormOpen(false); setEditingStream(null); resetForm(); }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Se salvează...
                      </>
                    ) : (
                      editingStream ? 'Actualizează' : 'Adaugă'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LiveStreamsAdminFirebase
