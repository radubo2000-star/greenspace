import Header from '../components/Header'
import ProgramsProjects from '../components/ProgramsProjects'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ScrollToTop from '../components/ScrollToTop'
import { motion } from 'framer-motion'

const ProjectsPage = () => {
  return (
    <>
      <SEO 
        title="Programele Noastre - Voluntariat, HUB Comunitar, PRO Școala | Asociația Green Space"
        description="Descoperă programele noastre structurate: Program Voluntariat, HUB Comunitar Tineret, PRO Școala. Proiecte și activități concrete pentru protejarea mediului și educație ecologică."
        keywords="programe mediu, voluntariat, ecologizări, plantări puieți, școala de vară, hub comunitar, educație ecologică, proiecte Erasmus+, activități în școli, protejarea naturii, România"
      />
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section for Projects */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-green-700/80 z-10" />
              <img
                src="/images/projects/tabere.jpg"
                alt="Proiectele Noastre - Asociația Green Space"
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
                    Programele Noastre
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto"
                >
                  Programe structurate cu proiecte și activități concrete
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center text-white"
                >
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    📋 3 Programe Active
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🎯 10 Proiecte Majore
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    ⚡ 30+ Activități
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    👥 100+ Voluntari Implicați
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Programs & Projects Component */}
          <ProgramsProjects />
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}

export default ProjectsPage
