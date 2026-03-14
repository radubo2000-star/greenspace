import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Eye, Heart, Users, Lightbulb, Shield } from 'lucide-react'
import { getYearsOfActivityFormatted, calculateYearsOfActivity } from '../utils/calculateYears'
import { useStatistics } from '../hooks/use-statistics'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { getSummary: summary, loading } = useStatistics()

  const mainValues = [
    {
      icon: Target,
      title: 'Misiunea Noastră',
      description: 'Promovarea problemelor de mediu, creșterea nivelului de educație în rândul elevilor și stimularea agrementului responsabil reprezintă misiunea noastră. Urmărim să o îndeplinim prin implicarea comunității în diferite acțiuni, proiecte și programe, care vor genera crearea unei rețele funcționale între instituțiile publice, partenerii privați și comunitate.',
      color: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      icon: Eye,
      title: 'Viziunea Noastră',
      description: 'Prin educație și solidaritate putem reduce substanțial problemele importante cu care comunitatea noastră se confruntă. Conștientizarea problemelor ne va ajuta să generăm practici sustenabile și să construim un viitor mai verde pentru generațiile următoare.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ]

  const coreValues = [
    {
      icon: Heart,
      title: 'Pasiune pentru Mediu',
      description: 'Dedicare totală pentru protecția și conservarea patrimoniului natural',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Users,
      title: 'Colaborare',
      description: 'Construim punți între instituții, companii și comunitate',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Lightbulb,
      title: 'Educație',
      description: 'Investim în educația ecologică a tinerilor și comunității',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Shield,
      title: 'Responsabilitate',
      description: 'Acționăm etic și transparent în toate proiectele noastre',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const achievements = [
    {
      number: getYearsOfActivityFormatted(),
      label: 'Ani de Activitate',
      description: 'Experiență în protecția mediului',
    },
    {
      number: loading ? '...' : summary.volunteersDisplay,
      label: 'Voluntari Activi',
      description: 'Comunitate dedicată',
    },
    {
      number: loading ? '...' : summary.plantingEventsDisplay,
      label: 'Evenimente de Plantare',
      description: 'Acțiuni de plantare organizate',
    },
    {
      number: loading ? '...' : summary.projectsDisplay,
      label: 'Proiecte Finalizate',
      description: 'Acțiuni concrete și măsurabile',
    },
  ]

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-gray-50 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 w-full max-w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Despre Asociația Green Space
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Suntem un grup de membri și voluntari dedicați promovării, protejării și conservării patrimoniului natural local și național
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="/images/despre-noi.jpg"
              alt="Echipa Green Space"
              className="rounded-2xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Povestea Noastră</h3>
            <p className="text-gray-600 mb-4 leading-relaxed text-justify">
              <strong>Asociația Green Space</strong> este o organizație non-profit înființată în 2020, dedicată protecției mediului și educației ecologice. Suntem un grup de membri și voluntari pasionați de promovarea, protejarea și conservarea patrimoniului natural local și național.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed text-justify">
              Ne propunem să reducem deficitul educațional informal și non-formal al tinerilor din comunitate, implicându-i activ în diverse acțiuni, proiecte și programe de mediu. Credem că prin educație și solidaritate putem genera schimbări reale și durabile.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed text-justify">
              <strong>Echipa noastră</strong> este formată din cadre didactice, elevi, antreprenori, corporatiști, cadre militare și funcționari publici cu statut special, având vârste cuprinse între 16 și 52 de ani. Diversitatea echipei noastre este forța noastră.
            </p>
            <p className="text-gray-600 leading-relaxed text-justify">
              În cei <strong>{calculateYearsOfActivity()} ani de activitate</strong>, am colaborat cu instituții și autorități locale și naționale, companii de stat care promovează exploatarea sustenabilă a resurselor naturale, precum și cu companii locale și internaționale care și-au asumat angajamentul de a acționa etic și responsabil față de mediu.
            </p>
          </motion.div>
        </div>

        {/* Mission & Vision - Modern Cards */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-green-500 text-white rounded-full text-sm font-bold shadow-lg inline-block">
              🎯 Scopul Nostru
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-3">
              Misiunea și Viziunea Noastră
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainValues.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                  
                  <div className="relative h-full p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent overflow-hidden">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5`} />
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className={`inline-flex p-5 ${value.bgColor} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        <Icon className={`w-10 h-10 ${value.iconColor}`} />
                      </motion.div>

                      <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-green-600 group-hover:bg-clip-text transition-all duration-300">
                        {value.title}
                      </h4>

                      <p className="text-gray-600 leading-relaxed text-base md:text-lg text-justify">
                        {value.description}
                      </p>

                      <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-r from-primary-400 to-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-r from-primary-400 to-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Core Values - Colorful Cards */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-full text-sm font-bold shadow-lg inline-block">
              💎 Principiile Noastre
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-3">
              Valorile Noastre Fundamentale
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.05 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 ${value.bgColor} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500`} />
                  
                  <div className="relative h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent overflow-hidden">
                    <div className={`absolute inset-0 ${value.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className={`inline-flex p-4 ${value.bgColor} rounded-2xl mb-5 shadow-md group-hover:shadow-xl transition-all`}
                      >
                        <Icon className={`w-7 h-7 ${value.color}`} />
                      </motion.div>

                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:scale-105 transition-transform">
                        {value.title}
                      </h4>

                      <p className="text-gray-600 text-sm leading-relaxed text-justify">
                        {value.description}
                      </p>

                      <div className={`absolute top-4 right-4 w-2 h-2 ${value.bgColor} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
                    </div>

                    <div className={`absolute bottom-0 left-0 right-0 h-1 ${value.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Impact Stats - Animated Numbers */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-12"
          >
            <span className="px-6 py-3 bg-gradient-to-r from-primary-600 via-green-600 to-emerald-600 text-white rounded-full text-sm font-bold shadow-xl inline-block">
              📊 Realizările Noastre
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6 mb-3">
              Impactul Nostru în Cifre
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.9 + index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-green-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500" />
                
                <div className="relative h-full bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/50 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-green-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  <div className="relative z-10 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-br from-primary-600 via-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm"
                    >
                      {achievement.number}
                    </motion.div>

                    <div className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-700 transition-colors">
                      {achievement.label}
                    </div>

                    <div className="text-gray-600 text-sm leading-relaxed text-justify">
                      {achievement.description}
                    </div>

                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-primary-500 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>

                  <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    ✨
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
