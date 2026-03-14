import Header from '../components/Header'
import Experiences from '../components/Experiences'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ScrollToTop from '../components/ScrollToTop'
import { motion } from 'framer-motion'
import { useScrollToHash } from '../hooks/useScrollToHash'

const ExperiencesPage = () => {
  useScrollToHash()
  return (
    <>
      <SEO 
        title="Experiențele noastre - Tabere, Ture cu Caiacul și Drumeții montane | Asociația Green Space"
        description="Tabere de vară pentru copii, ture cu caiacul pe Argeș și Dunăre, și drumeții montane. Experiențe care susțin proiectele noastre de conservare. La doar 45 min de București."
        keywords="tabere de vară, caiac, kayak, ture caiac, drumeții montane, hiking, Argeș, Dunăre, Oltenița, aventură, natură, eco-turism, team building, autofinanțare"
      />
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section for Experiences */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-green-800/85 to-emerald-700/80 z-10" />
              <img
                src="/images/experiences/kaiacedesus.webp"
                alt="Ture cu Caiacul - Asociația Green Space"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 py-32">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Experiențele noastre
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto"
                >
                  Tabere, ture cu caiacul și drumeții montane care susțin proiectele noastre de conservare a mediului
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center text-white"
                >
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🏕️ Tabere
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🛶 Ture cu Caiacul
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🏔️ Drumeții montane
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Experiences Component */}
          <Experiences />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}

export default ExperiencesPage
