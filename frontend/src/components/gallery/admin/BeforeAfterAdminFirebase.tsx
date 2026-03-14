import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, MapPin, Calendar, X, Loader2 } from 'lucide-react'
import { 
  subscribeToBeforeAfterProjects,
  createBeforeAfterProject,
  updateBeforeAfterProject,
  deleteBeforeAfterProject,
  type BeforeAfterProject 
} from '@/services/gallery-service'
import ImageSelector from '@/components/admin/ImageSelector'
import { getImagePreview } from '@/lib/image-preview-helper'

const BeforeAfterAdminFirebase = () => {
  const [items, setItems] = useState<BeforeAfterProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BeforeAfterProject | null>(null)
  const [formData, setFormData] = useState({
    beforeImage: '',
    afterImage: '',
    title: '',
    description: '',
    category: 'general',
    location: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToBeforeAfterProjects((data) => {
      setItems(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (editingItem) {
        await updateBeforeAfterProject(editingItem.id, formData)
      } else {
        await createBeforeAfterProject({ ...formData, timestamp: Date.now() })
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

  const handleEdit = (item: BeforeAfterProject) => {
    setEditingItem(item)
    setFormData({
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur vrei să ștergi această comparație?')) return
    try {
      await deleteBeforeAfterProject(id)
    } catch (err) {
      setError('Eroare la ștergere')
      console.error(err)
    }
  }

  const resetForm = () => {
    setFormData({
      beforeImage: '',
      afterImage: '',
      title: '',
      description: '',
      category: 'general',
      location: '',
      date: new Date().toISOString().split('T')[0]
    })
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
          <h2 className="text-2xl font-bold text-gray-900">Before/After</h2>
          <p className="text-gray-600 mt-1">{items.length} comparații în total</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adaugă Comparație
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={getImagePreview(item.beforeImage)} 
                    alt="Before" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load before image:', item.beforeImage)
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                    Înainte
                  </div>
                </div>
                <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={getImagePreview(item.afterImage)} 
                    alt="After" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load after image:', item.afterImage)
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                    }}
                  />
                  <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded">
                    După
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </div>
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

      {items.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nicio comparație adăugată</h3>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adaugă Comparație
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
                  {editingItem ? 'Editează Comparație' : 'Adaugă Comparație Nouă'}
                </h3>
                <button
                  onClick={() => { setIsFormOpen(false); setEditingItem(null); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <ImageSelector
                    value={formData.beforeImage}
                    onChange={(value) => setFormData({ ...formData, beforeImage: value })}
                    label="Imagine Înainte"
                    placeholder="Selectează imagine sau introdu URL"
                    required
                  />
                  {formData.beforeImage && (
                    <div className="mt-2">
                      <img 
                        src={getImagePreview(formData.beforeImage)} 
                        alt="Preview Înainte" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Failed to load before image preview:', formData.beforeImage)
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <ImageSelector
                    value={formData.afterImage}
                    onChange={(value) => setFormData({ ...formData, afterImage: value })}
                    label="Imagine După"
                    placeholder="Selectează imagine sau introdu URL"
                    required
                  />
                  {formData.afterImage && (
                    <div className="mt-2">
                      <img 
                        src={getImagePreview(formData.afterImage)} 
                        alt="Preview După" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+URL'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titlu *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Ecologizare Râul Dâmbovița"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categorie *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Ecologizare"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Locație *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: București"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
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

export default BeforeAfterAdminFirebase
