import { Link, useNavigate } from 'react-router-dom';
import { 
  Images, 
  Database, 
  FolderOpen,
  LogOut,
  BarChart3,
  Upload,
  ArrowLeft,
  FileText,
  MessageSquareQuote,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const adminCards = [
    {
      title: 'Statistici Anuale',
      description: 'Gestionează statisticile pentru fiecare an',
      icon: BarChart3,
      link: '/admin/annual-statistics',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      iconGradient: 'from-emerald-400 to-teal-500'
    },
    {
      title: 'Testimoniale',
      description: 'Gestionează testimonialele de pe prima pagină',
      icon: MessageSquareQuote,
      link: '/admin/testimonials',
      gradient: 'from-violet-500 via-purple-600 to-indigo-600',
      iconGradient: 'from-violet-400 to-indigo-500'
    },
    {
      title: 'Echipă',
      description: 'Gestionează membrii echipei de pe pagina „Echipa”',
      icon: Users,
      link: '/admin/team',
      gradient: 'from-teal-500 via-cyan-600 to-emerald-600',
      iconGradient: 'from-teal-400 to-emerald-500'
    },
    {
      title: 'Statistici Site',
      description: 'Vizualizează date și tendințe',
      icon: BarChart3,
      link: '/admin/statistics',
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      iconGradient: 'from-green-400 to-teal-500'
    },
    {
      title: 'Galerie Imagini',
      description: 'Upload și gestionează imaginile din galerie',
      icon: Images,
      link: '/galerie/admin',
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconGradient: 'from-blue-400 to-indigo-500'
    },
    {
      title: 'Administrare Media',
      description: 'Încarcă și gestionează imagini și video-uri',
      icon: Upload,
      link: '/admin/media',
      gradient: 'from-pink-500 via-rose-600 to-red-600',
      iconGradient: 'from-pink-400 to-red-500'
    },
    {
      title: 'Manager Fișiere',
      description: 'Gestionează donații, contacte și alte fișiere',
      icon: FolderOpen,
      link: '/admin/files',
      gradient: 'from-orange-500 via-amber-600 to-yellow-600',
      iconGradient: 'from-orange-400 to-yellow-500'
    },
    {
      title: 'Toate Datele',
      description: 'Vezi donații, voluntari, membri și mesaje',
      icon: Database,
      link: '/admin/data',
      gradient: 'from-purple-500 via-violet-600 to-fuchsia-600',
      iconGradient: 'from-purple-400 to-fuchsia-500'
    },
    {
      title: 'Documentație Internă',
      description: 'Planificare 2026, responsabilități și parteneri',
      icon: FileText,
      link: '/admin/docs',
      gradient: 'from-cyan-500 via-sky-600 to-blue-600',
      iconGradient: 'from-cyan-400 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Bine ai venit, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Înapoi la Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {adminCards.map((card, index) => {
            const Icon = card.icon;
            
            return (
              <Link
                key={index}
                to={card.link}
                className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8">
                  {/* Icon with Gradient */}
                  <div className="mb-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-justify">
                    {card.description}
                  </p>
                  
                  {/* Arrow */}
                  <div className="mt-6 flex items-center text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                    <span>Accesează</span>
                    <svg 
                      className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
