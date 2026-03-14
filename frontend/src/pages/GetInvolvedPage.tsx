import Header from '../components/Header'
import GetInvolved from '../components/GetInvolved'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ScrollToTop from '../components/ScrollToTop'
import { motion } from 'framer-motion'
import { useScrollToHash } from '../hooks/useScrollToHash'

const GetInvolvedPage = () => {
  useScrollToHash()
  return (
    <>
      <SEO 
        title="Implică-te - Donează, Voluntariat, Membru | Asociația Green Space"
        description="Alătură-te misiunii noastre! Devino voluntar, membru sau susține-ne prin donații. Împreună putem face diferența pentru mediu."
        keywords="voluntariat, donații, membru asociație, implică-te, susține mediul, ONG România, protejarea naturii"
      />
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section for Get Involved */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-green-800/85 to-emerald-700/80 z-10" />
              <img
                src="/images/projects/ecologizari.webp"
                alt="Implică-te - Asociația Green Space"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 pt-40 pb-20">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Implică-te
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto"
                >
                  Alătură-te misiunii noastre de protejare a mediului
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center text-white"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="f230ro-lansare bg-amber-500/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-amber-300 hover:bg-amber-600/90 transition-all cursor-pointer font-semibold shadow-lg"
                  >
                    ⭐ Redirecționează 3.5%
                  </motion.button>
                  <motion.a
                    href="#doneaza"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    💚 Donează
                  </motion.a>
                  <motion.a
                    href="#voluntariat"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    🤝 Voluntariat
                  </motion.a>
                  <motion.a
                    href="#parteneriat"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-all cursor-pointer"
                  >
                    🤝 Parteneriat
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Get Involved Component */}
          <GetInvolved />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}

export default GetInvolvedPage
