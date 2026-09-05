import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ScrollToTop from '../components/ScrollToTop'
import { getActiveTeamMembers } from '../services/team-member-service'
import { useAuth } from '../contexts/AuthContext'
import type { TeamMember } from '../types/team-member'

const TeamPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const loadMembers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getActiveTeamMembers()
        if (isMounted) {
          setMembers(data)
        }
      } catch (err) {
        console.error('Error loading team members:', err)
        if (isMounted) {
          setError('Nu s-au putut încărca membrii echipei. Încearcă din nou mai târziu.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMembers()
    return () => {
      isMounted = false
    }
  }, [])

  const defaultAvatar = '/images/logo.png'

  return (
    <>
      <SEO
        title="Echipa - Asociația Green Space"
        description="Cunoaște echipa Asociației Green Space: oamenii dedicați care fac posibile proiectele noastre de mediu și educație ecologică."
        keywords="echipa greenspace, membri asociatie, voluntari, echipa asociatie de mediu"
      />
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          {/* Hero Section */}
          <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-green-700/80 z-10" />
              <img
                src="/images/despre-noi.jpg"
                alt="Echipa Asociația Green Space"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="container mx-auto px-4 relative z-20 py-32">
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
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/30 text-sm font-semibold text-white">
                      👥 Oamenii din spatele proiectelor
                    </span>
                  </motion.div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Echipa Noastră
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
                >
                  Suntem un grup de oameni cu aceeași misiune, pasionați de protecția mediului și educația generațiilor viitoare.

                </motion.p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Membrii Echipei
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Fiecare dintre noi contribuie cu pasiune și dedicare la misiunea asociației. Cunoaște-i mai bine!
                </p>
              </motion.div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-500">Se încarcă echipa...</p>
                </div>
              ) : error ? (
                <div className="max-w-xl mx-auto text-center bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              ) : members.length === 0 ? (
                <div className="max-w-xl mx-auto text-center bg-gray-50 border-2 border-gray-200 rounded-2xl p-8">
                  <p className="text-gray-600">
                    Echipa noastră este în formare. Revino în curând pentru a cunoaște membrii!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
                  {members.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-emerald-200 overflow-hidden">
                        {/* Photo */}
                        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100">
                          <img
                            src={member.image || defaultAvatar}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src = defaultAvatar
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Info */}
                        <div className="p-6 text-center">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                            {member.name}
                          </h3>
                          {member.role && (
                            <p className="text-emerald-700 font-medium text-sm uppercase tracking-wide mb-3">
                              {member.role}
                            </p>
                          )}
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="inline-flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors text-sm"
                            >
                              <Mail className="w-4 h-4" />
                              {member.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-800 to-green-700 text-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-3xl mx-auto"
              >
                <Users className="w-14 h-14 mx-auto mb-6 text-emerald-300" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Vrei să faci parte din echipa noastră?
                </h2>
                <p className="text-lg text-emerald-100 mb-8 leading-relaxed">
                  Devino voluntar sau membru Green Space și contribuie activ la un viitor mai verde pentru comunitatea noastră.

                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/implica-te')}
                    className="inline-flex items-center justify-center gap-2 bg-white text-emerald-800 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all shadow-lg"
                  >
                    Implică-te Acum
                  </motion.button>
                  {user && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/admin/team')}
                      className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold border-2 border-white/30 hover:bg-white/20 transition-all"
                    >
                      Administrează Echipa
                    </motion.button>
                  )}
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

export default TeamPage