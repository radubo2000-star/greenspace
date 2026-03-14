import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, 
  Users, 
  Heart, 
  Handshake, 
  Mail, 
  UserPlus,
  DollarSign,
  Calendar,
  ArrowLeft,
  Activity,
  BarChart3,
  Eye,
  Globe,
  CreditCard,
  Building2,
  Repeat,
  RefreshCw,
  Trash2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { getBackendUrl } from '@/lib/backend-config';
import { getAuthHeaders } from '@/lib/auth-headers';

interface Statistics {
  overview: {
    totalContacts: number;
    totalVolunteers: number;
    totalMembers: number;
    totalPartnerships: number;
    totalDonations: number;
    totalDonationAmount: number;
    recentActivity: {
      contacts: number;
      volunteers: number;
      members: number;
      partnerships: number;
      donations: number;
    };
  };
  donations: {
    total: number;
    count: number;
    recurring: number;
    oneTime: number;
    byMethod: {
      card: number;
      bank: number;
    };
    average: number;
  };
  members: {
    total: number;
    byType: {
      student: number;
      individual: number;
      family: number;
    };
  };
  partnerships: {
    total: number;
    byType: {
      corporate: number;
      ngo: number;
      institution: number;
      media: number;
    };
  };
  volunteers: {
    total: number;
    topInterests: Array<{ name: string; count: number }>;
  };
  pageViews: {
    totalViews: number;
    uniquePaths: number;
    topPages: Array<{ path: string; title: string; views: number }>;
  };
  trends: {
    monthly: Array<{
      month: string;
      contacts: number;
      volunteers: number;
      members: number;
      donations: number;
      memberships: number;
      partnerships: number;
    }>;
    historical: {
      contacts: number;
      volunteers: number;
      members: number;
      donations: number;
      memberships: number;
      partnerships: number;
    };
  };
}

const StatisticsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resettingPageViews, setResettingPageViews] = useState(false);
  const resetDialogRef = useRef<HTMLDialogElement>(null);

  const fetchStatistics = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);

      const backendUrl = getBackendUrl();
      const headers = await getAuthHeaders();
      const response = await fetch(`${backendUrl}/admin/statistics`, { headers, signal });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStatistics(data.statistics);
      setLoading(false);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Request was cancelled by StrictMode cleanup — keep loading state
        // so we don't flash the error screen before the second mount fetches.
        return;
      }
      console.error('Error fetching statistics:', err);
      setError('Nu s-au putut încărca statisticile. Te rugăm să încerci din nou.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const controller = new AbortController();
    fetchStatistics(controller.signal);
    return () => {
      controller.abort();
    };
  }, [user, navigate, fetchStatistics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
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
            onClick={() => fetchStatistics()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals for revenue chart
  const totalLastYear = statistics.trends.monthly.reduce((sum, month) => 
    sum + month.donations + month.memberships, 0
  );
  const monthlyAverage = totalLastYear / 12;
  const totalHistorical = statistics.trends.historical.donations + statistics.trends.historical.memberships;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Statistici
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Vizualizare date și tendințe
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Pages - First Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-600" />
              Top 5 Pagini Cele Mai Vizitate
            </h2>
            <button
              onClick={() => resetDialogRef.current?.showModal()}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              title="Resetează statisticile vizualizărilor"
            >
              <Trash2 className="w-4 h-4" />
              Resetează
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
          <div className="space-y-4">
            {statistics.pageViews.topPages.map((page, index) => {
              const maxViews = statistics.pageViews.topPages[0]?.views || 1;
              const percentage = (page.views / maxViews) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{page.title}</span>
                    <span className="text-gray-600">{page.views} vizualizări</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overview Stats */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Prezentare Generală
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contacte */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                {statistics.overview.recentActivity.contacts > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{statistics.overview.recentActivity.contacts} recent
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Contacte</h3>
              <p className="text-3xl font-bold text-gray-900">{statistics.overview.totalContacts}</p>
            </div>

            {/* Voluntari */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <UserPlus className="w-6 h-6 text-green-600" />
                </div>
                {statistics.overview.recentActivity.volunteers > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{statistics.overview.recentActivity.volunteers} recent
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Voluntari</h3>
              <p className="text-3xl font-bold text-gray-900">{statistics.overview.totalVolunteers}</p>
            </div>

            {/* Membri */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                {statistics.overview.recentActivity.members > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{statistics.overview.recentActivity.members} recent
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Membri</h3>
              <p className="text-3xl font-bold text-gray-900">{statistics.overview.totalMembers}</p>
            </div>

            {/* Parteneriate */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Handshake className="w-6 h-6 text-orange-600" />
                </div>
                {statistics.overview.recentActivity.partnerships > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{statistics.overview.recentActivity.partnerships} recent
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Parteneriate</h3>
              <p className="text-3xl font-bold text-gray-900">{statistics.overview.totalPartnerships}</p>
            </div>

            {/* Donații */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                {statistics.overview.recentActivity.donations > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    +{statistics.overview.recentActivity.donations} recent
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Donații</h3>
              <p className="text-3xl font-bold text-gray-900">{statistics.overview.totalDonations}</p>
            </div>

            {/* Total Donații RON */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Donații (RON)</h3>
              <p className="text-3xl font-bold text-gray-900">
                {statistics.overview.totalDonationAmount.toLocaleString('ro-RO', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Evoluția Încasărilor - Ultimul An
          </h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-medium text-gray-600">Încasări Anterioare</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {totalHistorical.toLocaleString('ro-RO', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })} RON
              </p>
              <p className="text-xs text-gray-500 mt-1">Total istoric</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">Total Ultimul An</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {totalLastYear.toLocaleString('ro-RO', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })} RON
              </p>
              <p className="text-xs text-blue-700 mt-1">Ultimele 12 luni</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-sm font-medium text-green-900">Medie Lunară</h3>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {monthlyAverage.toLocaleString('ro-RO', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })} RON
              </p>
              <p className="text-xs text-green-700 mt-1">Per lună (ultimul an)</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={statistics.trends.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  stroke="#9ca3af"
                  tickFormatter={(value) => `${value} RON`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number) => [
                    `${value.toLocaleString('ro-RO', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })} RON`,
                    ''
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="donations" 
                  name="Donații" 
                  stackId="a"
                  fill="#ef4444" 
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="memberships" 
                  name="Cotizații Membri" 
                  stackId="a"
                  fill="#8b5cf6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donations Details */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-green-600" />
            Detalii Donații
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Donație Medie</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.donations.average.toLocaleString('ro-RO', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })} RON
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Repeat className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Donații Recurente</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{statistics.donations.recurring}</p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.donations.count > 0 
                  ? `${((statistics.donations.recurring / statistics.donations.count) * 100).toFixed(1)}% din total`
                  : '0% din total'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Plăți cu Card</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{statistics.donations.byMethod.card}</p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.donations.count > 0 
                  ? `${((statistics.donations.byMethod.card / statistics.donations.count) * 100).toFixed(1)}% din total`
                  : '0% din total'
                }
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Transfer Bancar</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">{statistics.donations.byMethod.bank}</p>
              <p className="text-xs text-gray-500 mt-1">
                {statistics.donations.count > 0 
                  ? `${((statistics.donations.byMethod.bank / statistics.donations.count) * 100).toFixed(1)}% din total`
                  : '0% din total'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Members by Type */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Membri pe Tipuri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Studenți</h3>
                  <span className="text-xs text-blue-600 font-medium">50 RON/an</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.members.byType.student}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Individual</h3>
                  <span className="text-xs text-purple-600 font-medium">100 RON/an</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.members.byType.individual}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-600">Familie</h3>
                  <span className="text-xs text-green-600 font-medium">200 RON/an</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.members.byType.family}</p>
            </div>
          </div>
        </div>

        {/* Partnerships by Type */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-green-600" />
            Parteneriate pe Tipuri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Companii</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.partnerships.byType.corporate}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">ONG-uri</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.partnerships.byType.ngo}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Instituții</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.partnerships.byType.institution}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Media</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.partnerships.byType.media}</p>
            </div>
          </div>
        </div>

        {/* Page Views Stats */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            Statistici Vizualizare Pagini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Total Vizualizări</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {statistics.pageViews.totalViews.toLocaleString('ro-RO')}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Pagini Unice</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{statistics.pageViews.uniquePaths}</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Medie/Pagină</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {statistics.pageViews.uniquePaths > 0 
                  ? Math.round(statistics.pageViews.totalViews / statistics.pageViews.uniquePaths)
                  : 0
                }
              </p>
            </div>
          </div>
        </div>

        {/* Top Volunteer Interests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            Top Interese Voluntari
          </h2>
          <div className="space-y-4">
            {statistics.volunteers.topInterests.map((interest, index) => {
              const maxCount = statistics.volunteers.topInterests[0]?.count || 1;
              const percentage = (interest.count / maxCount) * 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">{interest.name}</span>
                    <span className="text-gray-600">{interest.count} voluntari</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatisticsPage;
