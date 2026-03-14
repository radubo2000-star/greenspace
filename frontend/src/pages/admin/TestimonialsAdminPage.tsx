import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Star, GripVertical, ArrowLeft, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/toast';
import type { Testimonial, TestimonialFormData } from '@/types/testimonial';
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
} from '@/services/testimonial-service';
import ImageSelector from '@/components/admin/ImageSelector';

export default function TestimonialsAdminPage() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    role: '',
    image: '',
    quote: '',
    rating: 5,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast.error('Eroare', 'Nu s-au putut încărca testimonialele');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      image: '',
      quote: '',
      rating: 5,
      order: 0,
      isActive: true,
    });
    setEditingId(null);
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingId(testimonial.id);
      setFormData({
        name: testimonial.name,
        role: testimonial.role,
        image: testimonial.image,
        quote: testimonial.quote,
        rating: testimonial.rating,
        order: testimonial.order,
        isActive: testimonial.isActive,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await updateTestimonial(editingId, formData);
        toast.success('Succes!', 'Testimonial actualizat cu succes!');
      } else {
        await addTestimonial(formData);
        toast.success('Succes!', 'Testimonial adăugat cu succes!');
      }

      await loadTestimonials();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Eroare', 'A apărut o eroare la salvarea testimonialului.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest testimonial?')) return;

    try {
      await deleteTestimonial(id);
      toast.success('Succes!', 'Testimonial șters cu succes!');
      await loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Eroare', 'Nu s-a putut șterge testimonialul');
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleTestimonialStatus(id);
      toast.success('Succes!', 'Status actualizat cu succes!');
      await loadTestimonials();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Eroare', 'Nu s-a putut actualiza statusul');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Înapoi la panoul de administrare"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-600" />
                Gestionare Testimoniale
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Administrează testimonialele afișate pe prima pagină
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Testimoniale</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{testimonials.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {testimonials.filter(t => t.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {testimonials.filter(t => !t.isActive).length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <EyeOff className="w-8 h-8 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <Button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adaugă Testimonial
          </Button>
        </div>

        {/* Testimonials Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Ordine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Persoană</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Testimonial</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Se încarcă...
                    </td>
                  </tr>
                ) : testimonials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Nu există testimoniale. Adaugă primul testimonial!
                    </td>
                  </tr>
                ) : (
                  testimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{testimonial.order}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
                          {testimonial.quote}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < testimonial.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {testimonial.isActive ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activ
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactiv
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(testimonial.id)}
                            title={testimonial.isActive ? 'Dezactivează' : 'Activează'}
                          >
                            {testimonial.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(testimonial)}
                            title="Editează"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(testimonial.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Șterge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Editează Testimonial' : 'Adaugă Testimonial Nou'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <Label htmlFor="name">Nume *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Maria Popescu"
                      required
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <Label htmlFor="role">Rol *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Ex: Voluntar din 2022"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <ImageSelector
                      value={formData.image}
                      onChange={(value) => setFormData({ ...formData, image: value })}
                      label="Avatar *"
                      placeholder="Selectează imagine sau introdu URL"
                      isAvatar={true}
                      required
                    />
                    {formData.image && (
                      <div className="mt-3">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Quote */}
                  <div>
                    <Label htmlFor="quote">Testimonial *</Label>
                    <textarea
                      id="quote"
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      placeholder="Scrie testimonialul aici..."
                      rows={4}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.quote?.length || 0} caractere
                    </p>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label htmlFor="rating">Rating *</Label>
                    <select
                      id="rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {'⭐'.repeat(rating)} ({rating} {rating === 1 ? 'stea' : 'stele'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order */}
                  <div>
                    <Label htmlFor="order">Ordine *</Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      placeholder="0"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Ordinea de afișare în carousel (0 = primul)
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <Label htmlFor="isActive">Status *</Label>
                    <select
                      id="isActive"
                      value={formData.isActive.toString()}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="true">Activ (vizibil pe site)</option>
                      <option value="false">Inactiv (ascuns)</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseModal}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Anulează
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Se salvează...' : (editingId ? 'Actualizează' : 'Adaugă')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
