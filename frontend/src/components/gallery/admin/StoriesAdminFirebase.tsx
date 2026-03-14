import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Calendar, Image as ImageIcon, Video, X, Loader2 } from 'lucide-react'
import { 
  createStory, 
  updateStory, 
  deleteStory, 
  subscribeToStories,
  type Story 
} from '@/services/gallery-service'
import ImageSelector from '@/components/admin/ImageSelector'
import MediaSelector from '@/components/admin/MediaSelector'
import { getImagePreview } from '@/lib/image-preview-helper'
import { getThumbnailUrlFromVideoUrl, isLocalVideoUrl } from '@/lib/video-thumbnail-generator'
import { getYouTubeThumbnail, isYouTubeUrl } from '@/lib/youtube-helpers'

const StoriesAdminFirebase = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    url: '',
    thumbnail: '',
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [saving, setSaving] = useState(false)

  // Subscribe to stories from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToStories((data) => {
      setStories(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Auto-generate thumbnail for YouTube videos if not provided
      const dataToSave = { ...formData }
      if (dataToSave.type === 'video' && !dataToSave.thumbnail && dataToSave.url) {
        const autoThumbnail = getYouTubeThumbnail(dataToSave.url)
        if (autoThumbnail) {
          dataToSave.thumbnail = autoThumbnail
        }
      }

      if (editingStory) {
        await updateStory(editingStory.id, dataToSave)
      } else {
        await createStory({ ...dataToSave, timestamp: Date.now() })
      }
      
      setIsFormOpen(false)
      setEditingStory(null)
      resetForm()
    } catch (err) {
      setError('Eroare la salvarea story-ului')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (story: Story) => {
    setEditingStory(story)
    setFormData({
      type: story.type,
      url: story.url,
      thumbnail: story.thumbnail || '',
      title: story.title,
      description: story.description,
      location: story.location,
      date: story.date
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest story?')) return
    
    try {
      await deleteStory(id)
    } catch (err) {
      setError('Eroare la ștergerea story-ului')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'image',
      url: '',
      thumbnail: '',
      title: '',
      description: '',
      location: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingStory(null)
    resetForm()
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stories</h2>
          <p className="text-gray-600 mt-1">{stories.length} stories în total</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adaugă Story
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={getImagePreview(story.thumbnail || story.url)}
                  alt={story.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.warn('Failed to load story thumbnail, using fallback:', story.thumbnail || story.url)
                    // Use a nice gradient fallback
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%2310b981;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23059669;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="300"/%3E%3Ctext fill="white" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="16" font-family="Arial"%3E%F0%9F%8C%B1 Image not available%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
                  {story.type === 'image' ? (
                    <ImageIcon className="w-3 h-3" />
                  ) : (
                    <Video className="w-3 h-3" />
                  )}
                  {story.type}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {story.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {story.date}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(story)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(story.id)}
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

      {/* Empty State */}
      {stories.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Niciun story adăugat
          </h3>
          <p className="text-gray-600 mb-4">
            Începe prin a adăuga primul story
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adaugă Story
          </button>
        </div>
      )}

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onMouseDown={(e) => {
              // Close only if clicking directly on the overlay background
              if (e.target === e.currentTarget) {
                handleCancel()
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
              {/* Form Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingStory ? 'Editează Story' : 'Adaugă Story Nou'}
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tip
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="image"
                        checked={formData.type === 'image'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                        className="w-4 h-4 text-green-600"
                      />
                      <ImageIcon className="w-4 h-4" />
                      Imagine
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="video"
                        checked={formData.type === 'video'}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' })}
                        className="w-4 h-4 text-green-600"
                      />
                      <Video className="w-4 h-4" />
                      Video
                    </label>
                  </div>
                </div>

                {/* URL */}
                {formData.type === 'image' ? (
                  <ImageSelector
                    value={formData.url}
                    onChange={(value) => {
                      setFormData({ ...formData, url: value, thumbnail: value })
                    }}
                    label="URL Imagine *"
                    placeholder="Selectează imagine locală sau introdu URL"
                  />
                ) : (
                  <MediaSelector
                    value={formData.url}
                    onChange={(value) => {
                      // Auto-generate thumbnail for videos
                      let autoThumbnail = ''
                      
                      if (isYouTubeUrl(value)) {
                        autoThumbnail = getYouTubeThumbnail(value)
                      } else if (isLocalVideoUrl(value)) {
                        autoThumbnail = getThumbnailUrlFromVideoUrl(value)
                      }
                      
                      setFormData({ ...formData, url: value, thumbnail: autoThumbnail })
                    }}
                    label="URL Video *"
                    placeholder="Selectează video local sau introdu URL YouTube"
                    acceptedTypes={['video']}
                  />
                )}

                {/* Thumbnail */}
                {formData.type === 'image' && (
                  <div>
                    <ImageSelector
                      value={formData.thumbnail}
                      onChange={(value) => setFormData({ ...formData, thumbnail: value })}
                      label="URL Thumbnail *"
                      placeholder="Selectează thumbnail sau introdu URL"
                    />
                    {formData.url && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, thumbnail: formData.url })
                        }}
                        className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        title="Folosește imaginea principală ca thumbnail"
                      >
                        Folosește imaginea principală ca thumbnail
                      </button>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Poți folosi aceeași imagine sau o versiune optimizată
                    </p>
                  </div>
                )}

                {/* Thumbnail (optional for videos) */}
                {formData.type === 'video' && (
                  <div>
                    <ImageSelector
                      value={formData.thumbnail}
                      onChange={(value) => setFormData({ ...formData, thumbnail: value })}
                      label="Thumbnail Video (opțional - se generează automat pentru YouTube)"
                      placeholder="Selectează thumbnail sau introdu URL"
                    />
                    {formData.url && (
                      <button
                        type="button"
                        onClick={() => {
                          const autoThumbnail = getYouTubeThumbnail(formData.url)
                          if (autoThumbnail) {
                            setFormData({ ...formData, thumbnail: autoThumbnail })
                          }
                        }}
                        className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                      >
                        Auto-generează thumbnail YouTube
                      </button>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Pentru video-uri YouTube, thumbnail-ul se generează automat dacă nu este specificat
                    </p>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titlu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Plantare copaci în Parcul Herăstrău"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descriere *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descriere scurtă a story-ului..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locație *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: București, Sector 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
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
                      editingStory ? 'Actualizează' : 'Adaugă'
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

export default StoriesAdminFirebase
