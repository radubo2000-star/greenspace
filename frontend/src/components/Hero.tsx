import { motion } from 'framer-motion'
import { ArrowDown, Heart, Users, Sprout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStatistics } from '../hooks/use-statistics'

const Hero = () => {
  const navigate = useNavigate()
  const { getSummary: summary, loading } = useStatistics()

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Folosim datele reale din Firebase
  // - Evenimente de Plantare: suma tuturor anilor
  // - Participanți: suma tuturor anilor
  // - Voluntari: doar ultimul an (cei activi)
  const stats = [
    { icon: Sprout, value: loading ? '...' : summary.plantingEventsDisplay, label: 'Evenimente de Plantare' },
    { icon: Users, value: loading ? '...' : summary.participantsDisplay, label: 'Participanți' },
    { icon: Heart, value: loading ? '...' : summary.volunteersDisplay, label: 'Voluntari Activi' },
  ]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0 w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/85 to-emerald-700/80 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/banner.mp4" type="video/mp4" />
          <img
            src="/images/hero-bg.jpg"
            alt="Natură - Asociația Green Space"
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 pt-40 sm:pt-48 pb-32 w-full max-w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Protejăm Natura,
              <br />
              <span className="text-primary-300">Construim Viitorul</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-100 mb-12 max-w-2xl mx-auto"
          >
            Asociația Green Space este dedicată protejării și conservării mediului natural, promovând totodată un stil de viață sustenabil și responsabil în România.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/implica-te')}
              className="bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-xl"
            >
              Implică-te Acum
            </button>
            <button
              onClick={() => navigate('/despre')}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              Descoperă Mai Mult
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                {/* Hidden login button - click on first stat icon */}
                {index === 0 ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-10 h-10 text-primary-300 mx-auto mb-4 hover:text-primary-200 transition-colors cursor-pointer"
                    aria-label="Admin"
                    title=""
                  >
                    <stat.icon className="w-full h-full" />
                  </button>
                ) : (
                  <stat.icon className="w-10 h-10 text-primary-300 mx-auto mb-4" />
                )}
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <button
          type="button"
          onClick={() => scrollToSection('#impact')}
          className="text-white animate-bounce"
          aria-label="Scroll to impact section"
        >
          <ArrowDown className="w-8 h-8" />
        </button>
      </motion.div>
    </section>
  )
}

export default Hero
