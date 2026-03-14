import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnnualStatistics } from '../../types/statistics';
import { statisticsService } from '../../services/statistics-service';
import { useStatistics } from '../../hooks/use-statistics';
import { toast } from '../../components/ui/toast';

const StatisticsAdminPage = () => {
  const navigate = useNavigate();
  const { statistics, loading, refetch } = useStatistics();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<AnnualStatistics, 'id'>>({
    year: new Date().getFullYear(),
    volunteers: 0,
    treesPlanted: 0,
    projects: 0,
    events: 0,
    plantingEvents: 0,
    wasteCollected: 0,
    participants: 0,
  });

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      volunteers: 0,
      treesPlanted: 0,
      projects: 0,
      events: 0,
      plantingEvents: 0,
      wasteCollected: 0,
      participants: 0,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (stat: AnnualStatistics) => {
    setFormData({
      year: stat.year,
      volunteers: stat.volunteers,
      treesPlanted: stat.treesPlanted,
      projects: stat.projects,
      events: stat.events,
      plantingEvents: stat.plantingEvents || 0,
      wasteCollected: stat.wasteCollected || 0,
      participants: stat.participants || 0,
    });
    setEditingId(stat.id || null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Submitting form data:', formData);
    
    try {
      if (editingId) {
        console.log('✏️ Updating statistics with ID:', editingId);
        await statisticsService.update(editingId, formData);
        toast.success("Succes", "Statistici actualizate cu succes!");
      } else {
        console.log('➕ Adding new statistics');
        const id = await statisticsService.add(formData);
        console.log('✅ Statistics added with ID:', id);
        toast.success("Succes", "Statistici adăugate cu succes!");
      }
      
      await refetch();
      resetForm();
    } catch (error) {
      console.error('❌ Error saving statistics:', error);
      toast.error("Eroare", `Eroare la salvarea statisticilor: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sigur vrei să ștergi aceste statistici?')) return;
    
    try {
      await statisticsService.delete(id);
      toast.success("Succes", "Statistici șterse cu succes!");
      await refetch();
    } catch (error) {
      toast.error("Eroare", "Eroare la ștergerea statisticilor");
      console.error(error);
    }
  };

  const yearOptions = Array.from({ length: 8 }, (_, i) => 2020 + i);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă...</p>
        </div>
      </div>
    );
  }

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
                <BarChart3 className="w-8 h-8 text-green-600" />
                Gestionare Statistici Anuale
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Administrează statisticile pentru fiecare an de activitate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adaugă An Nou
          </button>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Editează Statistici' : 'Adaugă Statistici Noi'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      An *
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {yearOptions.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  {/* Required Fields */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Câmpuri Obligatorii</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Voluntari Activi *
                        </label>
                        <input
                          type="number"
                          value={formData.volunteers}
                          onChange={(e) => setFormData({ ...formData, volunteers: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Copaci Plantați *
                        </label>
                        <input
                          type="number"
                          value={formData.treesPlanted}
                          onChange={(e) => setFormData({ ...formData, treesPlanted: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proiecte Finalizate *
                        </label>
                        <input
                          type="number"
                          value={formData.projects}
                          onChange={(e) => setFormData({ ...formData, projects: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evenimente Organizate *
                        </label>
                        <input
                          type="number"
                          value={formData.events}
                          onChange={(e) => setFormData({ ...formData, events: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evenimente de Plantare
                        </label>
                        <input
                          type="number"
                          value={formData.plantingEvents}
                          onChange={(e) => setFormData({ ...formData, plantingEvents: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="0"
                          placeholder="Subset din evenimente totale"
                        />
                        <p className="text-xs text-gray-500 mt-1">Câte evenimente de plantare din totalul de evenimente</p>
                      </div>
                    </div>
                  </div>

                  {/* Optional Fields */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Câmpuri Opționale</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deșeuri Colectate (kg)
                        </label>
                        <input
                          type="number"
                          value={formData.wasteCollected || ''}
                          onChange={(e) => setFormData({ ...formData, wasteCollected: parseInt(e.target.value) || undefined })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="0"
                          placeholder="Opțional"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Participanți
                        </label>
                        <input
                          type="number"
                          value={formData.participants || ''}
                          onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || undefined })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          min="0"
                          placeholder="Opțional"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t">
                    <button
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                      {editingId ? 'Actualizează' : 'Salvează'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Anulează
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    An
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voluntari
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copaci
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proiecte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Evenimente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plantări
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deșeuri (kg)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participanți
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statistics.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      Nu există statistici. Adaugă primul an!
                    </td>
                  </tr>
                ) : (
                  statistics.map((stat) => (
                    <tr key={stat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.volunteers.toLocaleString('ro-RO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.treesPlanted.toLocaleString('ro-RO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.projects}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.events}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.plantingEvents || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.wasteCollected?.toLocaleString('ro-RO') || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.participants?.toLocaleString('ro-RO') || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(stat)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          <Edit2 className="w-4 h-4 inline" />
                        </button>
                        <button
                          onClick={() => stat.id && handleDelete(stat.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsAdminPage;
