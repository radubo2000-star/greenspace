import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Loader2, Video, Star } from 'lucide-react'
import { 
  subscribeToTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial 
} from '@/services/gallery-service'
import ImageSelector from '@/components/admin/ImageSelector'
import { getImagePreview } from '@/lib/image-preview-helper'
import { getYouTubeEmbedUrl, getYouTubeThumbnail, isYouTubeUrl } from '@/lib/youtube-helpers'
import { getThumbnailUrlFromVideoUrl, isLocalVideoUrl } from '@/lib/video-thumbnail-generator'

const TestimonialsAdminFirebase = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    videoUrl: '',
    thumbnail: '',
    title: '',
    description: '',
    rating: 5
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToTestimonials((data) => {
      setTestimonials(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // Convert YouTube URL to embed format
      const dataToSave = {
        ...formData,
        videoUrl: getYouTubeEmbedUrl(formData.videoUrl),
        timestamp: Date.now()
      }

      if (editingItem) {
        await updateTestimonial(editingItem.id, dataToSave)
      } else {
        await createTestimonial(dataToSave)
      }
      
      setIsFormOpen(false)
      setEditingItem(null)
      resetForm()
    } catch (err) {
      setError('Eroare la salvare')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      role: item.role,
      avatar: item.avatar,
      videoUrl: item.videoUrl,
      thumbnail: item.thumbnail || '',
      title: item.title || '',
      description: item.description || '',
      rating: item.rating || 5
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi acest testimonial?')) return
    try {
      await deleteTestimonial(id)
    } catch (err) {
      setError('Eroare la ștergere')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      avatar: '',
      videoUrl: '',
      thumbnail: '',
      title: '',
      description: '',
      rating: 5
    })
  }

  // Handler pentru detectarea automată a thumbnail-ului când se schimbă URL-ul
  const handleVideoUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, videoUrl: url }))
    
    if (!url) return

    let thumbnail = ''
    if (isYouTubeUrl(url)) {
      thumbnail = getYouTubeThumbnail(url)
    } else if (isLocalVideoUrl(url)) {
      thumbnail = getThumbnailUrlFromVideoUrl(url)
    }

    if (thumbnail) {
      setFormData(prev => ({ ...prev, thumbnail }))
    }
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
          <h2 className="text-2xl font-bold text-gray-900">Testimoniale Video</h2>
          <p className="text-gray-600 mt-1">{testimonials.length} testimoniale în total</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adaugă Testimonial
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={getImagePreview(item.thumbnail) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EVideo%3C/text%3E%3C/svg%3E'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load testimonial thumbnail:', item.thumbnail)
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EVideo%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  {item.duration || 'Video'}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={getImagePreview(item.avatar) || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle fill="%23ddd" cx="25" cy="25" r="25"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E'}
                    alt={item.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load testimonial avatar:', item.avatar)
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle fill="%23ddd" cx="25" cy="25" r="25"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">{item.role}</p>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {item.title || 'Testimonial'}
                </h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {item.description || 'Fără descriere'}
                </p>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (item.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
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

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Niciun testimonial adăugat</h3>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adaugă Testimonial
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
                setEditingItem(null);
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
                  {editingItem ? 'Editează Testimonial' : 'Adaugă Testimonial Nou'}
                </h3>
                <button
                  onClick={() => { setIsFormOpen(false); setEditingItem(null); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Închide formularul"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nume *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Maria Popescu"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                    <input
                      type="text"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Ex: Voluntar activ - 2 ani"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <ImageSelector
                    value={formData.avatar}
                    onChange={(value) => setFormData({ ...formData, avatar: value })}
                    label="Avatar *"
                    placeholder="Selectează imagine sau introdu URL"
                    required
                  />
                  {formData.avatar && (
                    <div className="mt-2">
                      <img 
                        src={getImagePreview(formData.avatar)} 
                        alt="Preview Avatar" 
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load avatar preview:', formData.avatar)
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="50" height="50"%3E%3Ccircle fill="%23ddd" cx="25" cy="25" r="25"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E?%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titlu Testimonial *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: De ce am devenit voluntar la Green Space"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descriere *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Povestea mea despre cum am descoperit pasiunea pentru protecția mediului..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Video *</label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => handleVideoUrlChange(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Thumbnail-ul se va genera automat când introduci URL-ul YouTube
                  </p>
                </div>

                <div>
                  <ImageSelector
                    value={formData.thumbnail}
                    onChange={(value) => setFormData({ ...formData, thumbnail: value })}
                    label="Thumbnail Video"
                    placeholder="Selectează imagine sau se va genera automat din URL-ul YouTube"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2">
                      <img 
                        src={getImagePreview(formData.thumbnail)} 
                        alt="Preview Thumbnail" 
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Failed to load thumbnail preview:', formData.thumbnail)
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Thumbnail%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    💡 Thumbnail-ul se generează automat din URL-ul YouTube sau poți selecta o imagine locală
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    title="Selectează rating-ul testimonialului"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'stea' : 'stele'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setIsFormOpen(false); setEditingItem(null); resetForm(); }}
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
                      editingItem ? 'Actualizează' : 'Adaugă'
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

export default TestimonialsAdminFirebase
