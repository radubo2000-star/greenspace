import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { Heart, Users, Briefcase, ArrowRight, Mail } from 'lucide-react'
import DonationModal from './DonationModal'
import VolunteerModal from './VolunteerModal'
import MemberModal from './MemberModal'
import PartnershipModal from './PartnershipModal'

const GetInvolved = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  const [isDonationOpen, setIsDonationOpen] = useState(false)
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false)
  const [isMemberOpen, setIsMemberOpen] = useState(false)
  const [isPartnershipOpen, setIsPartnershipOpen] = useState(false)

  // Load formular230.ro script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://formular230.ro/share/7fb530299'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const ways = [
    {
      id: 'redirectioneaza',
      icon: Heart,
      title: 'Redirecționează 3.5%',
      description: 'Cea mai importantă sursă de venituri pentru ONG-ul nostru! Redirecționează 3.5% din impozitul pe venit fără costuri suplimentare.',
      action: 'Completează Formularul 230',
      color: 'bg-amber-500',
      hoverColor: 'hover:bg-amber-600',
      onClick: () => {}, // Will be handled by f230ro-lansare class
      featured: true,
      useFormular230: true,
    },
    {
      id: 'doneaza',
      icon: Heart,
      title: 'Donează',
      description: 'Susține financiar proiectele noastre de protejare a mediului.',
      action: 'Donează Acum',
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      onClick: () => setIsDonationOpen(true),
    },
    {
      id: 'voluntariat',
      icon: Users,
      title: 'Voluntariat',
      description: 'Alătură-te echipei noastre de voluntari și participă la acțiuni concrete.',
      action: 'Devino Voluntar',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => setIsVolunteerOpen(true),
    },
    {
      id: 'parteneriat',
      icon: Briefcase,
      title: 'Parteneriat',
      description: 'Colaborează cu noi pentru proiecte de impact în comunitate.',
      action: 'Contactează-ne',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => setIsPartnershipOpen(true),
    },
  ]

  return (
    <section id="get-involved" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Implică-te
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fiecare contribuție contează. Alege modul în care vrei să ne susții misiunea
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {ways.map((way, index) => (
            <motion.div
              key={index}
              id={way.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group scroll-mt-20 relative ${
                way.featured ? 'ring-4 ring-amber-400 ring-opacity-50' : ''
              }`}
            >
              {way.featured && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                    ⭐ Important
                  </span>
                </div>
              )}
              <div className={`${way.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <way.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{way.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-justify">{way.description}</p>
              <button 
                onClick={way.onClick}
                className={`${way.color} ${way.hoverColor} text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center w-full transition-all group-hover:scale-105 ${
                  way.useFormular230 ? 'f230ro-lansare' : ''
                }`}
              >
                {way.action}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modals */}
        <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
        <VolunteerModal isOpen={isVolunteerOpen} onClose={() => setIsVolunteerOpen(false)} />
        <MemberModal isOpen={isMemberOpen} onClose={() => setIsMemberOpen(false)} />
        <PartnershipModal isOpen={isPartnershipOpen} onClose={() => setIsPartnershipOpen(false)} />

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-center shadow-2xl"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rămâi la Curent
          </h3>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Abonează-te la newsletter-ul nostru și primește noutăți despre proiecte și evenimente
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Adresa ta de email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary-300"
            />
            <button className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all whitespace-nowrap flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Abonează-te
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GetInvolved
