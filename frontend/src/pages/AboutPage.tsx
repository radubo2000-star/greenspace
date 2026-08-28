import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Target, Eye, Leaf, Users, Heart, Lightbulb, Shield, GraduationCap, Sparkles, Briefcase, Building2, Medal, Landmark } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Timeline from '../components/Timeline'
import SEO from '../components/SEO'
import ScrollToTop from '../components/ScrollToTop'
import { useScrollToHash } from '../hooks/useScrollToHash'
import { getYearsOfActivityFormatted, calculateYearsOfActivity } from '../utils/calculateYears'
import { useStatistics } from '../hooks/use-statistics'

const AboutPage = () => {
  useScrollToHash()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { getSummary: summary, loading } = useStatistics()

  const values = [
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

  const team = [
    {
      category: 'Cadre Didactice',
      description: 'Profesori pasionați care aduc educația ecologică în școli',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      category: 'Elevi',
      description: 'Tineri entuziaști care vor să facă diferența',
      icon: Sparkles,
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      category: 'Antreprenori',
      description: 'Lideri de business care susțin dezvoltarea durabilă',
      icon: Briefcase,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      category: 'Corporatiști',
      description: 'Profesioniști dedicați cauzei de mediu',
      icon: Building2,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      category: 'Cadre Militare',
      description: 'Disciplină și organizare în serviciul naturii',
      icon: Medal,
      gradient: 'from-slate-600 to-slate-800',
      bgColor: 'bg-gradient-to-br from-slate-50 to-gray-50',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-700',
    },
    {
      category: 'Funcționari Publici',
      description: 'Conectăm sectorul public cu acțiunile de mediu',
      icon: Landmark,
      gradient: 'from-indigo-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-blue-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
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
      description: 'Impact direct asupra mediului',
    },
    {
      number: loading ? '...' : summary.projectsDisplay,
      label: 'Proiecte Finalizate',
      description: 'Acțiuni concrete și măsurabile',
    },
  ]

  return (
    <>
      <SEO 
        title="Despre Noi - Asociația Green Space"
        description="Asociația Green Space este o organizație non-profit înființată în 2020, dedicată protecției mediului și educației ecologice. Aflați mai multe despre misiunea, viziunea și echipa noastră."
      />
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-green-700/80 z-10" />
              <img
                src="/images/despre-noi.jpg"
                alt="Despre Asociația Green Space"
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
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-block mb-6"
                  >
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Despre Asociația Green Space
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed text-justify"
                >
                  O organizație non-profit dedicată protecției mediului și educației ecologice din 2020
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center text-white"
                >
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🌱 {getYearsOfActivityFormatted()} Ani de Activitate
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    👥 {loading ? '...' : summary.volunteersDisplay} Voluntari Activi
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🌱 {loading ? '...' : summary.plantingEventsDisplay} Evenimente de Plantare
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    ⭐ {loading ? '...' : summary.projectsDisplay} Proiecte
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                  ref={ref}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8 }}
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
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Povestea Noastră
                  </h2>
                  <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
                    <p>
                      <strong className="text-gray-900">Asociația Green Space</strong> este o organizație non-profit înființată în <strong className="text-gray-900">2020</strong>, dedicată protecției mediului și educației ecologice. Suntem un grup de membri și voluntari pasionați de promovarea, protejarea și conservarea patrimoniului natural local și național.
                    </p>
                    <p>
                      Ne propunem să reducem deficitul educațional informal și non-formal al tinerilor din comunitate, implicându-i activ în diverse acțiuni, proiecte și programe de mediu. Credem că prin <strong className="text-gray-900">educație și solidaritate</strong> putem genera schimbări reale și durabile.
                    </p>
                    <p>
                      Echipa noastră diversă este formată din <strong className="text-gray-900">cadre didactice, elevi, antreprenori, corporatiști, cadre militare și funcționari publici</strong> cu statut special, având vârste cuprinse între <strong className="text-gray-900">16 și 52 de ani</strong>. Această diversitate este forța noastră și ne permite să abordăm problemele de mediu din multiple perspective.
                    </p>
                    <p>
                      În cei <strong className="text-gray-900">{calculateYearsOfActivity()} ani de activitate</strong>, am colaborat cu instituții și autorități locale și naționale, companii de stat care promovează exploatarea sustenabilă a resurselor naturale, precum și cu companii locale și internaționale care și-au asumat angajamentul de a acționa etic și responsabil față de mediu.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section id="misiune-viziune" className="py-20 bg-gradient-to-b from-gray-50 to-white scroll-mt-20 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block mb-4"
                >
                  <span className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-green-500 text-white rounded-full text-sm font-bold shadow-lg">
                    🎯 Scopul Nostru
                  </span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Misiunea și Viziunea Noastră
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Valorile fundamentale care ne ghidează în fiecare acțiune
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {values.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="relative group"
                    >
                      {/* Gradient Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                      
                      {/* Card */}
                      <div className="relative h-full p-10 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent overflow-hidden">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-5`} />
                          <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
                            backgroundSize: '32px 32px'
                          }} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon with Animation */}
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`inline-flex p-5 ${value.bgColor} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                          >
                            <Icon className={`w-10 h-10 ${value.iconColor}`} />
                          </motion.div>

                          {/* Title with Gradient on Hover */}
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-green-600 group-hover:bg-clip-text transition-all duration-300">
                            {value.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 leading-relaxed text-base md:text-lg text-justify">
                            {value.description}
                          </p>

                          {/* Decorative Corner Elements */}
                          <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-r from-primary-400 to-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute bottom-6 left-6 w-3 h-3 bg-gradient-to-r from-primary-400 to-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section id="valori" className="py-20 bg-white scroll-mt-20 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-0 w-64 h-64 bg-red-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200/10 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block mb-4"
                >
                  <span className="px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-full text-sm font-bold shadow-lg">
                    💎 Principiile Noastre
                  </span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Valorile Noastre Fundamentale
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Principiile care ne definesc și ne inspiră în fiecare zi
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {coreValues.map((value, index) => {
                  const Icon = value.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ y: -12, scale: 1.05 }}
                      className="group relative"
                    >
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 ${value.bgColor} rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-all duration-500`} />
                      
                      {/* Card */}
                      <div className="relative h-full p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 group-hover:border-transparent overflow-hidden">
                        {/* Animated Background */}
                        <div className={`absolute inset-0 ${value.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon Container with Pulse Effect */}
                          <motion.div
                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                            className={`inline-flex p-4 ${value.bgColor} rounded-2xl mb-5 shadow-md group-hover:shadow-xl transition-all`}
                          >
                            <Icon className={`w-7 h-7 ${value.color}`} />
                          </motion.div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:scale-105 transition-transform">
                            {value.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 text-sm leading-relaxed text-justify">
                            {value.description}
                          </p>

                          {/* Decorative Dot */}
                          <div className={`absolute top-4 right-4 w-2 h-2 ${value.bgColor} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </div>

                        {/* Bottom Accent Line */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 ${value.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center mt-16"
              >
                <div className="inline-block bg-gradient-to-r from-gray-50 to-white rounded-2xl px-8 py-5 shadow-lg border-2 border-gray-100">
                  <p className="text-gray-700 text-lg font-semibold">
                    🌟 Aceste valori ne ghidează în fiecare proiect și decizie
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Team Composition */}
          <section id="echipa" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden scroll-mt-20">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block mb-4"
                >
                  <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-green-500 text-white rounded-full text-sm font-semibold shadow-lg">
                    👥 Diversitate și Colaborare
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Echipa Noastră Diversă
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Membri și voluntari din diverse domenii, uniți de pasiunea pentru mediu
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {team.map((member, index) => {
                  const Icon = member.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group relative"
                    >
                      {/* Gradient Border Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${member.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />
                      
                      {/* Card Content */}
                      <div className={`relative h-full ${member.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-white/50 backdrop-blur-sm`}>
                        {/* Icon Container */}
                        <div className="flex items-center justify-center mb-6">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                            className={`${member.iconBg} p-4 rounded-2xl shadow-md`}
                          >
                            <Icon className={`w-8 h-8 ${member.iconColor}`} />
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 group-hover:bg-clip-text transition-all">
                            {member.category}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed text-justify">
                            {member.description}
                          </p>
                        </div>

                        {/* Decorative Corner Element */}
                        <div className={`absolute top-4 right-4 w-2 h-2 bg-gradient-to-r ${member.gradient} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
                        <div className={`absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r ${member.gradient} rounded-full opacity-50 group-hover:opacity-100 transition-opacity`} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center mt-16"
              >
                <div className="inline-block bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg border-2 border-gray-100">
                  <p className="text-gray-600 text-lg mb-2">
                    <span className="text-2xl">🎯</span> Vârste cuprinse între
                  </p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                    16 și 52 de ani
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Achievements */}
          <section className="py-24 bg-gradient-to-br from-primary-50 via-green-50 to-white relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-96 h-96 bg-primary-300/30 rounded-full blur-3xl animate-blob" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-300/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-20"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <span className="px-6 py-3 bg-gradient-to-r from-primary-600 via-green-600 to-emerald-600 text-white rounded-full text-sm font-bold shadow-xl">
                    📊 Realizările Noastre
                  </span>
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
                  Impactul Nostru în Cifre
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg md:text-xl">
                  Rezultate concrete ale muncii noastre dedicate pentru un viitor mai verde
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.15,
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
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-green-400 rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500" />
                    
                    {/* Card */}
                    <div className="relative h-full bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-white/50 overflow-hidden">
                      {/* Animated Background Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Decorative Circle */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-green-200 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      
                      {/* Content */}
                      <div className="relative z-10 text-center">
                        {/* Number with Animation */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                          className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-br from-primary-600 via-green-600 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm"
                        >
                          {achievement.number}
                        </motion.div>

                        {/* Label */}
                        <div className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-700 transition-colors">
                          {achievement.label}
                        </div>

                        {/* Description */}
                        <div className="text-gray-600 text-sm md:text-base leading-relaxed text-justify">
                          {achievement.description}
                        </div>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-primary-500 to-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      </div>

                      {/* Sparkle Effect */}
                      <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        ✨
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Context */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-center mt-16"
              >
                <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl px-10 py-6 shadow-xl border-2 border-gray-100">
                  <p className="text-gray-700 text-lg md:text-xl font-semibold">
                    🌱 Și continuăm să creștem în fiecare zi!
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center max-w-3xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Alătură-te Misiunii Noastre
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Fii parte din schimbarea pe care vrei să o vezi în lume. Împreună putem face diferența pentru mediul înconjurător.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.a
                    href="/implica-te"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-4 rounded-full font-semibold hover:from-primary-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Users className="w-5 h-5" />
                    Implică-te Acum
                  </motion.a>
                  <motion.a
                    href="/initiative/mediu-si-conservare"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-gray-200"
                  >
                    <Leaf className="w-5 h-5" />
                    Vezi Inițiativele Noastre
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Timeline Section */}
          <Timeline />
        </main>
        <Footer />
        <ScrollToTop />
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
    </>
  )
}

export default AboutPage
