import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  TreePine, 
  Recycle, 
  GraduationCap, 
  Users, 
  Sprout,
  Droplets,
  Wind,
  Sun,
  ArrowRight
} from 'lucide-react'
import { useStatistics } from '../hooks/use-statistics'

const OurActions = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('all')
  const { getSummary: summary, loading } = useStatistics()

  const categories = [
    { id: 'all', label: 'Toate', icon: Sprout },
    { id: 'environment', label: 'Mediu', icon: TreePine },
    { id: 'education', label: 'Educație', icon: GraduationCap },
    { id: 'community', label: 'Comunitate', icon: Users },
  ]

  const actions = [
    {
      category: 'environment',
      icon: TreePine,
      title: 'Plantări',
      description: 'Organizăm campanii de împădurire și regenerare a zonelor verzi',
      stats: loading ? '...' : `${summary.plantingEventsDisplay} evenimente`,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      image: '🌳',
    },
    {
      category: 'environment',
      icon: Recycle,
      title: 'Reciclare și Colectare',
      description: 'Campanii de colectare selectivă și educație pentru reciclare',
      stats: '50+ tone reciclate',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      image: '♻️',
    },
    {
      category: 'education',
      icon: GraduationCap,
      title: 'Educație Ecologică',
      description: 'Workshopuri și prezentări în școli despre protecția mediului',
      stats: '5,000+ elevi educați',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      image: '📚',
    },
    {
      category: 'environment',
      icon: Droplets,
      title: 'Protecția Apelor',
      description: 'Monitorizare și curățare a râurilor și lacurilor locale',
      stats: '15 km de râu curățat',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      image: '💧',
    },
    {
      category: 'community',
      icon: Users,
      title: 'Voluntariat Comunitar',
      description: 'Mobilizăm comunitatea în acțiuni de îmbunătățire a mediului',
      stats: loading ? '...' : `${summary.volunteersDisplay} voluntari activi`,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      image: '🤝',
    },
    {
      category: 'environment',
      icon: Wind,
      title: 'Calitatea Aerului',
      description: 'Monitorizare și campanii pentru reducerea pollution',
      stats: '20 stații de monitorizare',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      image: '🌬️',
    },
    {
      category: 'education',
      icon: Sun,
      title: 'Energie Regenerabilă',
      description: 'Promovăm și educăm despre sursele alternative de energie',
      stats: '30+ proiecte susținute',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      image: '☀️',
    },
    {
      category: 'community',
      icon: Sprout,
      title: 'Grădini Urbane',
      description: 'Creăm și întreține spații verzi în zonele urbane',
      stats: '25 grădini comunitare',
      color: 'from-lime-500 to-green-500',
      bgColor: 'bg-lime-50',
      iconColor: 'text-lime-600',
      image: '🌱',
    },
  ]

  const filteredActions = activeCategory === 'all' 
    ? actions 
    : actions.filter(action => action.category === activeCategory)

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-semibold">
              Acțiunile Noastre
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Cum Facem Diferența
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            Descoperă proiectele și inițiativele prin care protejăm mediul și educăm comunitatea
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-primary-600 to-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Actions Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {filteredActions.map((action, index) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Emoji decoration */}
                  <div className="absolute -top-4 -right-4 text-6xl opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                    {action.image}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`inline-flex p-3 ${action.bgColor} rounded-xl mb-4 relative z-10`}
                  >
                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 relative z-10">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 relative z-10 leading-relaxed text-justify">
                    {action.description}
                  </p>

                  {/* Stats */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${action.bgColor} rounded-full relative z-10`}>
                    <span className={`text-xs font-semibold ${action.iconColor}`}>
                      {action.stats}
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute bottom-6 right-6 z-10"
                  >
                    <ArrowRight className={`w-5 h-5 ${action.iconColor}`} />
                  </motion.div>

                  {/* Decorative element */}
                  <div className={`absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br ${action.color} rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300`}></div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-600 mb-4 text-base md:text-lg">
            Vrei să faci parte din aceste acțiuni?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/implica-te"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-primary-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              Devino Voluntar
            </motion.a>
            <motion.a
              href="/initiative/mediu-si-conservare"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              Vezi Toate Inițiativele
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}

export default OurActions
