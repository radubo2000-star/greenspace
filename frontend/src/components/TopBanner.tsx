import { X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useBanner } from '../contexts/BannerContext'

const TopBanner = () => {
  const { isBannerVisible, closeBanner } = useBanner()
  const navigate = useNavigate()

  if (!isBannerVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[70] bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 text-white overflow-hidden"
      >
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"
          />
        </div>

        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 relative z-10">
          <div className="flex items-center justify-between gap-2 max-w-full">
            {/* Content */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 overflow-hidden">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="hidden sm:block flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 overflow-hidden">
                <span className="font-bold text-xs sm:text-sm md:text-base leading-tight truncate">
                  🏕️ Summer Camp 2026
                </span>
                <span className="hidden xs:inline text-xs sm:text-sm opacity-90 leading-tight flex-shrink-0">
                  •
                </span>
                <span className="text-xs sm:text-sm md:text-sm opacity-90 leading-tight flex-shrink-0">
                  Siriu
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                navigate('/summer-camp')
                closeBanner()
              }}
              className="bg-white text-green-600 px-3 sm:px-4 md:px-5 py-1 sm:py-1.5 rounded-full font-semibold text-xs sm:text-sm hover:bg-green-50 transition-all hover:scale-105 shadow-lg flex-shrink-0"
            >
              <span className="hidden sm:inline">Înscrie-te</span>
              <span className="sm:hidden">Info</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closeBanner}
              className="text-white/80 hover:text-white transition-colors p-0.5 sm:p-1 flex-shrink-0 ml-1"
              aria-label="Închide banner"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default TopBanner
