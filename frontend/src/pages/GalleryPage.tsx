import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import Stories from '../components/gallery/Stories'
import VideoTestimonials from '../components/gallery/VideoTestimonials'
import BeforeAfterSlider from '../components/gallery/BeforeAfterSlider'
import LiveStreams from '../components/gallery/LiveStreams'
import { Video, Users, Repeat, Radio } from 'lucide-react'

const GalleryPage = () => {
  const [activeTab, setActiveTab] = useState<'stories' | 'testimonials' | 'beforeafter' | 'live'>('stories')

  const tabs = [
    { id: 'stories', name: 'Stories', icon: Video, description: 'Momente din proiecte' },
    { id: 'testimonials', name: 'Testimoniale', icon: Users, description: 'Povești de la voluntari' },
    { id: 'beforeafter', name: 'Before/After', icon: Repeat, description: 'Transformări vizibile' },
    { id: 'live', name: 'Live Streams', icon: Radio, description: 'Evenimente în direct' },
  ]

  return (
    <>
      <SEO
        title="Galerie Video & Stories - Asociația Green Space"
        description="Descoperă momentele speciale din proiectele noastre: stories, testimoniale video, transformări before/after și live streaming evenimente."
        keywords="galerie video, stories ecologice, testimoniale voluntari, before after ecologizare, live streaming evenimente ecologice"
        image="/images/gallery-og.jpg"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-green-800/85 to-emerald-700/80 z-10" />
          <img
            src="/images/experiences/kaiacedesus.webp"
            alt="Galerie Video & Stories - Asociația Green Space"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 pt-40 pb-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Galerie Video & Stories
            </h1>
            <p className="text-xl text-gray-100 mb-8">
              Descoperă impactul real al acțiunilor noastre prin imagini, video-uri și povești inspiraționale
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs Navigation Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            {/* Desktop: Grid 4 coloane */}
            <div className="hidden md:grid md:grid-cols-4 gap-4">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex flex-col items-center gap-3 px-6 py-6 rounded-2xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-xl scale-105 ring-4 ring-primary-400/50'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-200'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                    <div className="text-center">
                      <div className="font-semibold text-lg">{tab.name}</div>
                      <div className={`text-sm mt-1 ${activeTab === tab.id ? 'text-green-100' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Mobile: Stack vertical */}
            <div className="md:hidden flex flex-col gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-4 px-6 py-5 rounded-2xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-600 text-white shadow-xl ring-4 ring-primary-400/50'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border border-gray-200'
                    }`}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-base">{tab.name}</div>
                      <div className={`text-sm mt-0.5 ${activeTab === tab.id ? 'text-green-100' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'stories' && <Stories />}
            {activeTab === 'testimonials' && <VideoTestimonials />}
            {activeTab === 'beforeafter' && <BeforeAfterSlider />}
            {activeTab === 'live' && <LiveStreams />}
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default GalleryPage
