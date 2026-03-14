import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import Header from '../components/Header'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Contact - Asociația Green Space"
        description="Contactează-ne pentru întrebări, colaborări sau pentru a te alătura misiunii noastre de protejare a mediului."
        keywords="contact green space, asociatie ecologica contact, voluntariat contact, tabere contact"
      />
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-green-800/85 to-emerald-700/80 z-10" />
          <img
            src="/images/experiences/2dunare.jpg"
            alt="Contact - Asociația Green Space"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Contactează-ne
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Ai întrebări sau vrei să colaborezi cu noi? Suntem aici pentru tine!
              </p>
            </motion.div>

            {/* Quick Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-6 justify-center text-white mt-12"
            >
              <a
                href="mailto:contact@asociatiagreenspace.ro"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-all"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
              <a
                href="tel:0755503679"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                <span>Telefon</span>
              </a>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                <MapPin className="w-5 h-5" />
                <span>Olteniţa</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  )
}

export default ContactPage
