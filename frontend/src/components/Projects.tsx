import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { TreePine, Droplets, Recycle, GraduationCap, MapPin, Calendar, Tent, Sun, Heart, School, Compass } from 'lucide-react'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const projects = [
    {
      icon: Recycle,
      title: 'Ecologizări Argeș & Dunăre',
      description: 'Acțiuni de curățare a malurilor râului Argeș, Dunării și zonelor de vărsare. Participare gratuită pentru voluntari.',
      image: '/images/projects/ecologizari.webp',
      location: 'Gura de vărsare, Mitreni',
      date: 'Martie - Septembrie 2026',
      impact: 'Voluntariat gratuit',
      color: 'from-amber-500 to-orange-600',
      volunteer: true,
    },
    {
      icon: TreePine,
      title: 'Plantări cu Ocolul Silvic',
      description: 'Campanii de plantare a copacilor în parteneriat cu Ocolul Silvic Mitreni pentru refacerea ecosistemelor naturale.',
      image: '/images/projects/plantari.webp',
      location: 'Mitreni',
      date: 'Februarie & Noiembrie 2026',
      impact: 'Voluntariat gratuit',
      color: 'from-green-500 to-emerald-600',
      volunteer: true,
    },
    {
      icon: Heart,
      title: 'AGS Help! - Acțiuni Umanitare',
      description: 'Program de ajutor și suport pentru comunități afectate de dezastre naturale și probleme de mediu.',
      image: '/images/projects/ags-help.jpg',
      location: 'Național',
      date: 'Aprilie & Decembrie 2026',
      impact: 'Voluntariat gratuit',
      color: 'from-red-500 to-pink-600',
      volunteer: true,
    },
    {
      icon: GraduationCap,
      title: 'Tabere Educaționale',
      description: 'Tabere educaționale de mediu pentru tineri, promovând educația ecologică și conștientizarea problemelor de mediu.',
      image: '/images/projects/tabere.jpg',
      location: 'Național',
      date: '2023-2024',
      impact: '10,000+ participanți',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Tent,
      title: 'Campări',
      description: 'Experiențe de camping ecologic în natură, învățând despre biodiversitate și conservarea mediului.',
      image: '/images/projects/campari.jpg',
      location: 'Munții Carpați',
      date: '2024',
      impact: '500+ camperi',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      icon: Sun,
      title: 'Școala de vară',
      description: 'Program intensiv de educație ecologică pentru tineri, cu ateliere practice și activități în aer liber.',
      image: '/images/projects/scoala-vara.jpg',
      location: 'Național',
      date: '2024',
      impact: '2,000+ elevi',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: School,
      title: 'Activități în școli',
      description: 'Programe educaționale interactive despre mediu, reciclare și sustenabilitate în școli din toată țara.',
      image: '/images/projects/scoli.jpg',
      location: 'Național',
      date: '2024',
      impact: '150+ școli',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Compass,
      title: 'ECO Turism',
      description: 'Tururi ecologice și drumeții educaționale care promovează turismul responsabil și protejarea naturii.',
      image: '/images/projects/eco-turism.jpg',
      location: 'Național',
      date: '2024',
      impact: '3,000+ turiști',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: Droplets,
      title: 'Ecologizări pe Apă',
      description: 'Curățarea și protejarea râurilor, lacurilor și zonelor acvatice din România.',
      image: '/images/projects/ecologizari-apa.jpg',
      location: 'Dunăre, Mureș, Olt',
      date: '2023-2024',
      impact: '15 tone deșeuri colectate',
      color: 'from-blue-500 to-cyan-600',
    },
  ]

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Proiectele Noastre
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            Descoperă inițiativele noastre care fac diferența pentru mediu și comunități
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-semibold">Voluntariat Gratuit</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-semibold">Evenimente 2026</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${project.color} opacity-60`}></div>
                
                {/* Icon */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-xl">
                  <project.icon className="w-6 h-6 text-gray-900" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-justify">{project.description}</p>

                {/* Meta Info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{project.date}</span>
                  </div>
                </div>

                {/* Impact Badge */}
                <div className="flex flex-wrap gap-2">
                  <div className="inline-block bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {project.impact}
                  </div>
                  {project.volunteer && (
                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                      <Heart className="w-3 h-3" />
                      Voluntariat
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">Vrei să afli mai multe despre proiectele noastre?</p>
          <button className="bg-primary-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 shadow-lg">
            Vezi Toate Proiectele
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
