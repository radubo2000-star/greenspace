import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import SEO from './SEO'
import ScrollToTop from './ScrollToTop'
import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, Clock, Users, Phone } from 'lucide-react'

export interface InitiativeActivity {
  title: string
  description: string
  icon: string
}

export interface InitiativeExperience {
  title: string
  description: string
  image: string
  location?: string
  duration?: string
  price?: string
  features?: string[]
}

export interface InitiativeContent {
  slug: string
  title: string
  navName: string
  hero: {
    image: string
    badge: string
    heading: string
    lead: string
    tags: string[]
  }
  intro: string
  activities: InitiativeActivity[]
  experiences: InitiativeExperience[]
  ctaTitle: string
  ctaText: string
}

const InitiativePage = ({ content }: { content: InitiativeContent }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <>
      <SEO
        title={`${content.hero.heading} | Asociația Green Space`}
        description={content.intro}
        keywords={`${content.hero.tags.join(', ')}, Asociația Green Space, inițiative, mediu`}
      />
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-teal-800/80 z-10" />
              <img
                src={content.hero.image}
                alt={content.hero.heading}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-20 container mx-auto px-4 py-32">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="inline-block px-5 py-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white/90 rounded-full text-sm font-semibold mb-4">
                    {content.hero.badge}
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    {content.hero.heading}
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto"
                >
                  {content.hero.lead}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center text-white"
                >
                  {content.hero.tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30"
                    >
                      {tag}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </section>

          {/* Intro */}
          <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-lg md:text-xl text-gray-600 leading-relaxed text-justify"
              >
                {content.intro}
              </motion.p>
            </div>
          </section>

          {/* Activities */}
          <section className="pb-16 md:pb-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-semibold">
                  Activitățile noastre
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">
                  Ce facem în cadrul inițiativei
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Acțiuni concrete și proiecte pe care le desfășurăm în comunitate
                </p>
              </motion.div>

              <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {content.activities.map((activity, index) => (
                  <motion.div
                    key={activity.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="bg-white rounded-2xl p-7 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="text-4xl mb-4">{activity.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-justify">{activity.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Experiences */}
          {content.experiences.length > 0 && (
            <section className="py-16 md:py-24 bg-white">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-semibold">
                    Experiențe în natură
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-3">
                    Experiențe care susțin inițiativa
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Participă la activitățile noastre și contribuie direct la misiunea de protejare a naturii
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {content.experiences.map((experience, index) => (
                    <motion.div
                      key={experience.title}
                      initial={{ opacity: 0, y: 50 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={experience.image}
                          alt={experience.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-justify text-sm">
                          {experience.description}
                        </p>
                        <div className="space-y-2 mb-5">
                          {experience.location && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                              <span>{experience.location}</span>
                            </div>
                          )}
                          {experience.duration && (
                            <div className="flex items-center text-gray-500 text-sm">
                              <Clock className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                              <span>{experience.duration}</span>
                            </div>
                          )}
                          {experience.price && (
                            <div className="flex items-center text-emerald-600 text-sm font-semibold">
                              <span className="mr-2">💰</span>
                              <span>{experience.price}</span>
                            </div>
                          )}
                        </div>
                        {experience.features && (
                          <ul className="space-y-2 mb-5">
                            {experience.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="flex items-start text-sm text-gray-600">
                                <ChevronRight className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-10 md:p-14 text-white shadow-2xl"
              >
                <h3 className="text-3xl font-bold mb-4">{content.ctaTitle}</h3>
                <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">{content.ctaText}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/implica-te"
                    className="flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
                  >
                    <Users className="w-5 h-5" />
                    Implică-te
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 bg-emerald-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-900 transition-all hover:scale-105 border-2 border-white/30"
                  >
                    <Phone className="w-5 h-5" />
                    Contactează-ne
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}

export default InitiativePage