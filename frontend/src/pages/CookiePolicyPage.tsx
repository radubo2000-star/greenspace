import { motion } from 'framer-motion'
import { Cookie, Info, Settings, Shield, Eye, Calendar, Mail } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const CookiePolicyPage = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: 'Cookie-uri Esențiale',
      color: 'blue',
      description: 'Aceste cookie-uri sunt necesare pentru funcționarea corectă a site-ului și nu pot fi dezactivate în sistemele noastre.',
      examples: [
        'Cookie-uri de sesiune pentru autentificare',
        'Cookie-uri pentru securitate',
        'Cookie-uri pentru preferințe de limbă',
      ],
    },
    {
      icon: Eye,
      title: 'Cookie-uri de Performanță',
      color: 'green',
      description: 'Aceste cookie-uri ne permit să numărăm vizitele și sursele de trafic pentru a putea măsura și îmbunătăți performanța site-ului nostru.',
      examples: [
        'Google Analytics pentru statistici de vizitare',
        'Cookie-uri pentru monitorizarea timpului de încărcare',
        'Cookie-uri pentru analiza comportamentului utilizatorilor',
      ],
    },
    {
      icon: Settings,
      title: 'Cookie-uri Funcționale',
      color: 'purple',
      description: 'Aceste cookie-uri permit site-ului să ofere funcționalitate îmbunătățită și personalizare.',
      examples: [
        'Preferințe de afișare (mod întunecat/luminos)',
        'Setări de accesibilitate',
        'Preferințe de notificări',
      ],
    },
  ]

  const sections = [
    {
      title: 'Ce sunt cookie-urile?',
      content: [
        'Cookie-urile sunt fișiere text mici care sunt plasate pe computerul, smartphone-ul sau alt dispozitiv atunci când vizitați un site web. Cookie-urile sunt utilizate pe scară largă pentru a face site-urile web să funcționeze sau să funcționeze mai eficient, precum și pentru a furniza informații proprietarilor site-ului.',
        'Cookie-urile pot fi "persistente" sau "de sesiune". Cookie-urile persistente rămân pe computerul personal sau pe dispozitivul mobil atunci când vă deconectați, în timp ce cookie-urile de sesiune sunt șterse imediat ce închideți browserul web.',
      ],
    },
    {
      title: 'Cum folosim cookie-urile?',
      content: [
        'Asociația GreenSpace folosește cookie-uri pentru a îmbunătăți experiența utilizatorilor pe site-ul nostru web. Folosim cookie-uri pentru a înțelege cum interactionați cu conținutul nostru și pentru a vă ajuta să navigați mai eficient între pagini.',
        'Cookie-urile ne ajută, de asemenea, să înțelegem ce secțiuni ale site-ului nostru sunt cele mai populare, permițându-ne să îmbunătățim conținutul și să oferim o experiență mai bună utilizatorilor noștri.',
      ],
    },
    {
      title: 'Gestionarea cookie-urilor',
      content: [
        'Majoritatea browserelor web vă permit să controlați cookie-urile prin setările browserului. Cu toate acestea, dacă limitați capacitatea site-urilor web de a seta cookie-uri, este posibil să vă înrăutățiți experiența generală a utilizatorului, deoarece aceasta nu va mai fi personalizată pentru dvs.',
        'De asemenea, este posibil să nu puteți salva setările personalizate, cum ar fi informațiile de conectare.',
      ],
    },
  ]

  const browserGuides = [
    { name: 'Google Chrome', link: 'https://support.google.com/chrome/answer/95647' },
    { name: 'Mozilla Firefox', link: 'https://support.mozilla.org/ro/kb/cookie-uri-informatii-stocate-site-uri-calculator' },
    { name: 'Safari', link: 'https://support.apple.com/ro-ro/guide/safari/sfri11471/mac' },
    { name: 'Microsoft Edge', link: 'https://support.microsoft.com/ro-ro/microsoft-edge/ștergeți-cookie-urile-în-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-block">
                <Cookie className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Politica de Cookie-uri
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Informații despre cum folosim cookie-urile pe site-ul nostru și cum le puteți gestiona
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-white/80"
            >
              <Calendar className="w-5 h-5" />
              <span>Ultima actualizare: Ianuarie 2024</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-12"
            >
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Despre această politică
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Această politică de cookie-uri explică ce sunt cookie-urile și cum le folosim pe site-ul Asociației GreenSpace. Vă recomandăm să citiți această politică pentru a înțelege ce tip de cookie-uri folosim, informațiile pe care le colectăm folosind cookie-urile și cum sunt utilizate aceste informații.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cookie Types */}
            <div className="mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-gray-900 mb-8 text-center"
              >
                Tipuri de Cookie-uri
              </motion.h2>

              <div className="grid md:grid-cols-3 gap-6">
                {cookieTypes.map((type, index) => {
                  const Icon = type.icon
                  const colorClasses = {
                    blue: {
                      bg: 'from-blue-50 to-cyan-50',
                      iconBg: 'bg-blue-100',
                      iconColor: 'text-blue-600',
                      border: 'border-blue-200',
                    },
                    green: {
                      bg: 'from-green-50 to-emerald-50',
                      iconBg: 'bg-green-100',
                      iconColor: 'text-green-600',
                      border: 'border-green-200',
                    },
                    purple: {
                      bg: 'from-purple-50 to-pink-50',
                      iconBg: 'bg-purple-100',
                      iconColor: 'text-purple-600',
                      border: 'border-purple-200',
                    },
                  }[type.color] || {
                    bg: 'from-gray-50 to-gray-100',
                    iconBg: 'bg-gray-100',
                    iconColor: 'text-gray-600',
                    border: 'border-gray-200',
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`bg-gradient-to-br ${colorClasses.bg} rounded-2xl p-6 border-2 ${colorClasses.border} hover:shadow-lg transition-shadow`}
                    >
                      <div className={`${colorClasses.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${colorClasses.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">
                        {type.title}
                      </h3>
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed text-justify">
                        {type.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-600 uppercase">
                          Exemple:
                        </p>
                        <ul className="space-y-1">
                          {type.examples.map((example, eIndex) => (
                            <li key={eIndex} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-primary-500 mt-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Information Sections */}
            <div className="space-y-8 mb-16">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-gray-700 leading-relaxed text-justify">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex}>{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Browser Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-8 border-2 border-gray-200 mb-12"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <Settings className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Setări Browser
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Pentru informații despre cum să gestionați cookie-urile în browserul dvs., consultați ghidurile de mai jos:
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {browserGuides.map((browser, index) => (
                  <a
                    key={index}
                    href={browser.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-xl hover:shadow-md transition-shadow border border-gray-200 group"
                  >
                    <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {browser.name}
                    </span>
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl p-8 border-2 border-primary-100"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Aveți întrebări despre cookie-uri?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Dacă aveți întrebări sau nelămuriri cu privire la utilizarea cookie-urilor pe site-ul nostru, vă rugăm să ne contactați:
                  </p>
                  <a
                    href="mailto:contact@asociatiagreenspace.ro"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    contact@asociatiagreenspace.ro
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default CookiePolicyPage
