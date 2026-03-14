import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Globe, 
  TrendingUp, 
  Clock,
  ArrowLeft,
  Calendar,
  BarChart3,
  Activity,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendUrl } from '@/lib/backend-config';
import { getAuthHeaders } from '@/lib/auth-headers';

interface PageViewStatistics {
  totalViews: number;
  uniquePaths: number;
  topPages: Array<{ path: string; title: string; views: number; percentage: string }>;
  recentViews: Array<{ path: string; title: string; timestamp: string; referrer: string | null }>;
  viewsByDay: Array<{ date: string; views: number }>;
  viewsByHour: Array<{ hour: number; time: string; views: number }>;
}

const PageViewAnalyticsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<PageViewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resettingPageViews, setResettingPageViews] = useState(false);
  const resetDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchStatistics();
  }, [user, navigate]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/analytics/page-views`);

      if (!response.ok) {
        throw new Error('Failed to fetch page view statistics');
      }

      const data = await response.json();
      setStatistics(data.statistics);
    } catch (err) {
      console.error('Error fetching page view statistics:', err);
      setError('Nu s-au putut încărca statisticile. Te rugăm să încerci din nou.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Se încarcă statisticile...</p>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Eroare la încărcarea statisticilor'}</p>
          <button
            onClick={fetchStatistics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  const maxDayViews = Math.max(...statistics.viewsByDay.map(d => d.views), 1);
  const maxHourViews = Math.max(...statistics.viewsByHour.map(h => h.views), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/statistics')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Eye className="w-8 h-8 text-blue-600" />
                  Analiză Vizualizări Pagini
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Statistici detaliate despre traficul pe site
                </p>
              </div>
            </div>
            <button
              onClick={() => resetDialogRef.current?.showModal()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              title="Resetează statisticile vizualizărilor"
            >
              <Trash2 className="w-4 h-4" />
              Resetează Statistici
            </button>
          </div>

          {/* Reset Confirmation Dialog */}
          <dialog
            ref={resetDialogRef}
            className="rounded-xl shadow-2xl border border-gray-200 p-0 backdrop:bg-black/50 max-w-md w-full"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmare Resetare</h3>
              <p className="text-gray-600 mb-6">
                Ești sigur că vrei să resetezi toate statisticile de vizualizări ale paginilor? Această acțiune nu poate fi anulată.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => resetDialogRef.current?.close()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={async () => {
                    resetDialogRef.current?.close();
                    setResettingPageViews(true);
                    try {
                      const backendUrl = getBackendUrl();
                      const headers = await getAuthHeaders();
                      const response = await fetch(`${backendUrl}/analytics/page-views`, {
                        method: 'DELETE',
                        headers,
                      });
                      if (!response.ok) throw new Error('Failed to reset');
                      await fetchStatistics();
                    } catch (err) {
                      console.error('Error resetting page views:', err);
                    } finally {
                      setResettingPageViews(false);
                    }
                  }}
                  disabled={resettingPageViews}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {resettingPageViews ? 'Se resetează...' : 'Da, resetează'}
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total Vizualizări</h3>
            <p className="text-3xl font-bold text-gray-900">{statistics.totalViews.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pagini Unice</h3>
            <p className="text-3xl font-bold text-gray-900">{statistics.uniquePaths}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Medie / Pagină</h3>
            <p className="text-3xl font-bold text-gray-900">
              {statistics.uniquePaths > 0 
                ? (statistics.totalViews / statistics.uniquePaths).toFixed(1)
                : '0'}
            </p>
          </div>
        </div>

        {/* Top Pages */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Top Pagini Cele Mai Vizitate
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="space-y-4">
              {statistics.topPages.map((page, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                          <div className="text-xs text-gray-500">{page.path}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{page.views}</div>
                      <div className="text-xs text-gray-500">{page.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 ml-11">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Views by Day */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-600" />
            Vizualizări pe Zile (Ultimele 30 Zile)
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="space-y-2">
              {statistics.viewsByDay.map((day, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-24 text-xs text-gray-600 font-medium">
                    {new Date(day.date).toLocaleDateString('ro-RO', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(day.views / maxDayViews) * 100}%` }}
                      >
                        {day.views > 0 && (
                          <span className="text-xs font-bold text-white">{day.views}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Views by Hour */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Vizualizări pe Ore (Ultimele 24 Ore)
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="space-y-2">
              {statistics.viewsByHour.map((hour, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-xs text-gray-600 font-medium">
                    {hour.time}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                        style={{ width: `${(hour.views / maxHourViews) * 100}%` }}
                      >
                        {hour.views > 0 && (
                          <span className="text-xs font-bold text-white">{hour.views}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Views */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-600" />
            Vizualizări Recente
          </h2>
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Pagină</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Cale</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Referrer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.recentViews.map((view, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900 font-medium">{view.title}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 font-mono">{view.path}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {view.referrer ? (
                          <span className="text-blue-600">{new URL(view.referrer).hostname}</span>
                        ) : (
                          <span className="text-gray-400 italic">Direct</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(view.timestamp).toLocaleString('ro-RO', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageViewAnalyticsPage;
