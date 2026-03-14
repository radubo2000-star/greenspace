import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import { Video, Users, Repeat, Radio, Settings, Image, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import StoriesAdminFirebase from '../components/gallery/admin/StoriesAdminFirebase'
import TestimonialsAdminFirebase from '../components/gallery/admin/TestimonialsAdminFirebase'
import BeforeAfterAdminFirebase from '../components/gallery/admin/BeforeAfterAdminFirebase'
import LiveStreamsAdminFirebase from '../components/gallery/admin/LiveStreamsAdminFirebase'

const GalleryAdminPage = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'testimonials' | 'beforeafter' | 'live'>('stories')
  const { user } = useAuth()
  const navigate = useNavigate()

  const tabs= [
    { id: 'stories', name: 'Stories', icon: Video, count: 6 },
    { id: 'testimonials', name: 'Testimoniale', icon: Users, count: 4 },
    { id: 'beforeafter', name: 'Before/After', icon: Repeat, count: 5 },
    { id: 'live', name: 'Live Streams', icon: Radio, count: 2 },
  ]

  return (
    <>
      <SEO
        title="Administrare Galerie - Asociația Green Space"
        description="Panou de administrare pentru gestionarea conținutului galeriei: stories, testimoniale, before/after și live streams."
        keywords="admin galerie, administrare conținut, management galerie"
      />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Înapoi la panoul de administrare"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <Settings className="w-8 h-8 text-green-600" />
                  Administrare Galerie
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Gestionează conținutul galeriei: adaugă, editează sau șterge elemente
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Autentificat ca: <span className="font-semibold">{user?.email}</span>
              </p>
              <button
                onClick={() => navigate('/admin/media')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Image className="w-4 h-4" />
                Administrare Media
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Desktop: Grid */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'stories' | 'testimonials' | 'beforeafter' | 'live')}
                    className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-200'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold text-sm">{tab.name}</div>
                      <div className={`text-xs mt-1 ${activeTab === tab.id ? 'text-green-100' : 'text-gray-500'}`}>
                        {tab.count} elemente
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Mobile: Stack vertical */}
            <div className="md:hidden flex flex-col gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'stories' | 'testimonials' | 'beforeafter' | 'live')}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold">{tab.name}</span>
                    </div>
                    <span className={`text-sm ${activeTab === tab.id ? 'text-green-100' : 'text-gray-500'}`}>
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'stories' && <StoriesAdminFirebase />}
            {activeTab === 'testimonials' && <TestimonialsAdminFirebase />}
            {activeTab === 'beforeafter' && <BeforeAfterAdminFirebase />}
            {activeTab === 'live' && <LiveStreamsAdminFirebase />}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default GalleryAdminPage
