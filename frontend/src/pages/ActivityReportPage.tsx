import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { calculateYearsOfActivity } from '../utils/calculateYears'
import { 
  FileText, 
  Calendar, 
  Download, 
  TrendingUp, 
  Users, 
  Target,
  Leaf,
  Heart,
  BookOpen,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import ScrollToTop from '../components/ScrollToTop'
import { useStatistics } from '../hooks/use-statistics'

const ActivityReportPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { getSummary: summary, loading } = useStatistics()

  // Function to handle PDF download
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
      // Fallback to direct link
      window.open(url, '_blank')
    }
  }

  const reports = [
    {
      year: '2025',
      title: 'Raport de Activitate 2025',
      description: 'Dezvoltare organizațională, educație ecologică și promovare ecoturism',
      highlights: [
        'Școala de Vară AGS: 10 ședințe cu peste 25 copii/activitate',
        'Lansare platformă www.kayakromania.ro și documentare maluri Dunăre',
        'Tabără caiac ~25 tineri și drumeție Piatra Craiului ~18 elevi',
        '2 ecologizări: 560 kg deșeuri (total cumulat 4.582 kg)',
        '1.000 puieți plop plantați - rată prindere 90%',
        '4 acțiuni educaționale în școli pe teme ecologice',
        '2 workshopuri competențe emoționale pentru cadre didactice',
        'Calificări echipă: Formator, Ghid turism, Salvamar, BLS, Inspector SSM'
      ],
      downloadUrl: '/reports/Raport-de-activitate-2025.pdf',
      available: true
    },
    {
      year: '2024',
      title: 'Raport de Activitate 2024',
      description: 'Protejarea mediului, educație ecologică, dezvoltarea ecoturismului și sprijin umanitar',
      highlights: [
        '5 ecologizări - 1,220 kg deșeuri, 80+ voluntari (Pădurea Tăpșan, Dunăre, Argeș)',
        '450+ arbori plantați în 2 acțiuni de reîmpădurire',
        '15 acțiuni educație ecologică - 55 elevi în școli partenere',
        'Tabără caiac 2 zile - 19 elevi voluntari, tehnici vâslire și siguranță',
        'Inițiere ecoturism 3 zile - 17 tineri, trasee montane și conduită ecologică',
        '5 evenimente demonstrative caiac pe Dunăre și Argeș',
        '2 campanii umanitare - 50 persoane sprijinite',
        '82 acțiuni online și locale de conștientizare'
      ],
      downloadUrl: '/reports/Raport-de-activitate-2024.pdf',
      available: true
    },
    {
      year: '2023',
      title: 'Raport de Activitate 2023',
      description: 'Realizări și impact în anul 2023',
      highlights: [
        'Peste 15,000 plantări',
        '1,200+ voluntari activi',
        '25 proiecte finalizate',
        '8 tabere educaționale organizate'
      ],
      downloadUrl: '/reports/Raport-de-activitate-2023.pdf',
      available: true
    },
    {
      year: '2022',
      title: 'Raport de Activitate 2022',
      description: 'Realizări și impact în anul 2022',
      highlights: [
        'Peste 12,000 plantări',
        '950+ voluntari activi',
        '20 proiecte finalizate',
        '6 tabere educaționale organizate'
      ],
      downloadUrl: '/reports/Raport-de-activitate-2022.pdf',
      available: true
    },
    {
      year: '2021',
      title: 'Raport de Activitate 2021',
      description: 'Realizări și impact în anul 2021',
      highlights: [
        'Peste 10,000 plantări',
        '750+ voluntari activi',
        '18 proiecte finalizate',
        '5 tabere educaționale organizate'
      ],
      downloadUrl: '/reports/Raport-de-activitate-2021.pdf',
      available: true
    },
    {
      year: '2020',
      title: 'Raport de Activitate 2020',
      description: 'Realizări și impact în anul 2020',
      highlights: [
        'Peste 8,000 plantări',
        '600+ voluntari activi',
        '15 proiecte finalizate',
        '4 tabere educaționale organizate'
      ],
      downloadUrl: '/reports/Raport-de-activitate-2020.pdf',
      available: true
    }
  ]

  const keyMetrics = [
    {
      icon: Leaf,
      value: loading ? '...' : summary.plantingEventsDisplay,
      label: 'Evenimente de Plantare',
      description: `În ultimii ${calculateYearsOfActivity()} ani`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      value: loading ? '...' : summary.volunteersDisplay,
      label: 'Voluntari Activi',
      description: 'În ultimul an',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Target,
      value: loading ? '...' : summary.projectsDisplay,
      label: 'Proiecte',
      description: 'Finalizate cu succes',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Heart,
      value: loading ? '...' : summary.participantsDisplay,
      label: 'Participanți',
      description: 'La toate evenimentele',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const impactAreas = [
    {
      icon: Leaf,
      title: 'Protecția Mediului',
      description: 'Plantări de puieți, ecologizări și conservarea biodiversității',
      stats: loading ? '...' : `${summary.plantingEventsDisplay} evenimente de plantare`
    },
    {
      icon: BookOpen,
      title: 'Educație Ecologică',
      description: 'Programe educaționale pentru tineri și comunitate',
      stats: '23 tabere educaționale'
    },
    {
      icon: Users,
      title: 'Implicare Comunitară',
      description: 'Mobilizarea voluntarilor și parteneriatelor',
      stats: '3,500+ voluntari'
    },
    {
      icon: Heart,
      title: 'Impact Social',
      description: 'Creșterea conștientizării și schimbarea comportamentului',
      stats: '78 proiecte finalizate'
    }
  ]

  return (
    <>
      <SEO 
        title="Raport de Activitate - Asociația Green Space"
        description="Consultați rapoartele anuale de activitate ale Asociației Green Space. Transparență totală privind proiectele, realizările și impactul nostru asupra mediului."
        keywords="raport activitate, transparență, impact mediu, realizări, proiecte finalizate, Green Space"
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
                src="/images/projects/plantari.webp"
                alt="Raport de Activitate - Asociația Green Space"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 pt-40 pb-20">
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
                    <br/>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-lg border border-white/30">
                      Transparență și Responsabilitate
                    </span>
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    Raport de Activitate
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed text-justify"
                >
                  Descoperă impactul nostru și realizările din fiecare an de activitate
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-wrap gap-4 justify-center text-white"
                >
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    📊 Transparență Totală
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    📈 Impact Măsurabil
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30">
                    🎯 Rezultate Concrete
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Key Metrics Section */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Impactul Nostru în Cifre
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Rezultate cumulative din {calculateYearsOfActivity()} ani de activitate dedicată mediului
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {keyMetrics.map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className={`inline-flex p-4 ${metric.bgColor} rounded-2xl mb-4`}>
                        <Icon className={`w-8 h-8 ${metric.color}`} />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                        {metric.value}
                      </div>
                      <div className="text-xl font-semibold mb-1 text-gray-900">
                        {metric.label}
                      </div>
                      <div className="text-gray-600 text-sm">
                        {metric.description}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Impact Areas */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Domeniile Noastre de Impact
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Acțiuni concrete în patru direcții principale
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {impactAreas.map((area, index) => {
                  const Icon = area.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-primary-50 rounded-xl">
                            <Icon className="w-6 h-6 text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {area.title}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            {area.description}
                          </p>
                          <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                            <CheckCircle className="w-4 h-4" />
                            {area.stats}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Annual Reports */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Rapoarte Anuale
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Consultă rapoartele noastre detaliate de activitate pentru fiecare an
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {reports.map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden group"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-green-600 p-6 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <FileText className="w-6 h-6" />
                          <span className="text-2xl font-bold">{report.year}</span>
                        </div>
                        <Calendar className="w-5 h-5 opacity-80" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">
                        {report.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {report.description}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary-600" />
                          Realizări Principale
                        </h4>
                        <ul className="space-y-2">
                          {report.highlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Download Button */}
                      {report.available ? (
                        <button
                          onClick={() => handleDownload(report.downloadUrl, `Raport-de-activitate-${report.year}.pdf`)}
                          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-primary-600 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg group-hover:scale-105"
                        >
                          <Download className="w-5 h-5" />
                          Descarcă Raportul
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed">
                          <FileText className="w-5 h-5" />
                          În Pregătire
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Transparency Statement */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary-50 rounded-2xl">
                      <BarChart3 className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Angajamentul Nostru pentru Transparență
                    </h2>
                  </div>
                  
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      La <strong className="text-gray-900">Asociația Green Space</strong>, credem că transparența este fundamentală pentru construirea încrederii cu comunitatea noastră. De aceea, publicăm anual rapoarte detaliate de activitate care documentează:
                    </p>
                    
                    <ul className="space-y-3 ml-6">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-gray-900">Proiectele realizate</strong> - descrieri detaliate ale tuturor acțiunilor și inițiativelor</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-gray-900">Impactul măsurabil</strong> - cifre concrete despre rezultatele obținute</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-gray-900">Utilizarea resurselor</strong> - transparență financiară și gestionarea fondurilor</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-gray-900">Parteneriatele</strong> - colaborările cu instituții și organizații</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-gray-900">Planurile de viitor</strong> - obiective și direcții strategice</span>
                      </li>
                    </ul>

                    <p className="pt-4">
                      Fiecare raport este pregătit cu atenție pentru a oferi o imagine completă și onestă a activității noastre, demonstrând responsabilitatea față de comunitate, parteneri și mediul înconjurător.
                    </p>
                  </div>
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
                  Vrei să Faci Parte din Următorul Raport?
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Alătură-te echipei noastre de voluntari și contribuie la crearea unui impact pozitiv asupra mediului.
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
                    href="/proiecte"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border-2 border-gray-200"
                  >
                    <Leaf className="w-5 h-5" />
                    Vezi Proiectele
                  </motion.a>
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

export default ActivityReportPage
