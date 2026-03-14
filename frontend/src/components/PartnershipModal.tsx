import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Briefcase, Check, Building2, Users, Heart, Loader2 } from 'lucide-react'
import { submitPartnershipProposal } from '../services/partnership-service'
import { toast } from '../components/ui/toast'

interface PartnershipModalProps {
  isOpen: boolean
  onClose: () => void
}

const PartnershipModal = ({ isOpen, onClose }: PartnershipModalProps) => {
  const [partnershipType, setPartnershipType] = useState<'corporate' | 'ngo' | 'institution' | 'media'>('corporate')
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    employees: '',
    interests: [] as string[],
    budget: '',
    description: '',
    goals: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const partnershipTypes = [
    { value: 'corporate' as const, label: 'Companie', icon: Building2 },
    { value: 'ngo' as const, label: 'ONG', icon: Users },
    { value: 'institution' as const, label: 'Instituție', icon: Heart },
    { value: 'media' as const, label: 'Media', icon: Briefcase },
  ]

  const interestOptions = [
    'Sponsorizare evenimente',
    'CSR Projects',
    'Voluntariat corporativ',
    'Donații în natură',
    'Campanii de conștientizare',
    'Educație ecologică',
    'Parteneriat strategic',
    'Media partnership',
  ]

  const handleInterestToggle = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.includes(interest)
        ? formData.interests.filter((i) => i !== interest)
        : [...formData.interests, interest],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.interests.length === 0) {
      toast.error('Eroare', 'Te rugăm să selectezi cel puțin un domeniu de interes')
      return
    }

    setIsSubmitting(true)

    try {
      await submitPartnershipProposal({ partnershipType, ...formData })
      
      toast.success('Propunere trimisă!', 'Propunerea ta a fost trimisă cu succes! Verifică-ți emailul pentru confirmare.')
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          companyName: '',
          contactPerson: '',
          position: '',
          email: '',
          phone: '',
          website: '',
          industry: '',
          employees: '',
          interests: [],
          budget: '',
          description: '',
          goals: '',
        })
        onClose()
      }, 3000)
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'A apărut o eroare la trimiterea propunerii')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Parteneriat</h2>
                      <p className="text-green-100">Colaborează cu noi</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                    title="Închide modalul"
                    aria-label="Închide modalul"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center"
                >
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Mulțumim pentru interes!</h3>
                  <p className="text-xl text-gray-600 mb-2">
                    Propunerea ta de parteneriat a fost trimisă cu succes.
                  </p>
                  <p className="text-gray-500">
                    Echipa noastră te va contacta în maximum 3 zile lucrătoare pentru a discuta detaliile.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Partnership Process Info */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-center">Cum funcționează parteneriatul?</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                        <h4 className="font-semibold text-sm mb-1">Contact Inițial</h4>
                        <p className="text-xs text-gray-600">Completezi formularul de mai jos</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                        <h4 className="font-semibold text-sm mb-1">Întâlnire</h4>
                        <p className="text-xs text-gray-600">Discutăm proiectele și nevoile</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                        <h4 className="font-semibold text-sm mb-1">Acord</h4>
                        <p className="text-xs text-gray-600">Definim beneficiile și responsabilitățile</p>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">4</div>
                        <h4 className="font-semibold text-sm mb-1">Colaborare</h4>
                        <p className="text-xs text-gray-600">Implementare și raportare constantă</p>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tip organizație
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {partnershipTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setPartnershipType(type.value)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            partnershipType === type.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                            partnershipType === type.value ? 'text-green-600' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-center">Impactul nostru în 2024</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">500+</div>
                        <div className="text-xs text-gray-600">Participanți</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">15+</div>
                        <div className="text-xs text-gray-600">Evenimente</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">200km</div>
                        <div className="text-xs text-gray-600">Dunăre explorată</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">5+</div>
                        <div className="text-xs text-gray-600">Acțiuni ecologizare</div>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Benefits */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-blue-600" />
                      Beneficii parteneriat
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Vizibilitate crescută</h4>
                          <p className="text-xs text-gray-600">Logo pe materiale, website și evenimente</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Impact social măsurabil</h4>
                          <p className="text-xs text-gray-600">Contribuție directă la protecția mediului</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Raportare transparentă</h4>
                          <p className="text-xs text-gray-600">Rapoarte detaliate de impact și rezultate</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Networking</h4>
                          <p className="text-xs text-gray-600">Acces la comunitatea noastră activă</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Implicare angajați</h4>
                          <p className="text-xs text-gray-600">Oportunități de voluntariat corporativ</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Certificare CSR</h4>
                          <p className="text-xs text-gray-600">Documente pentru raportare CSR</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nume organizație *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="SC Example SRL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Persoană de contact *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="Ion Popescu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Funcție *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="CSR Manager"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="contact@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefon *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="+40 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Domeniu de activitate
                      </label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        placeholder="IT, Retail, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Număr angajați
                      </label>
                      <select
                        value={formData.employees}
                        onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                        title="Selectează numărul de angajați"
                      >
                        <option value="">Selectează...</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                  </div>

                  {/* Areas of Interest */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Domenii de interes * (selectează cel puțin unul)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            formData.interests.includes(interest)
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Buget estimat (opțional)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                      title="Selectează bugetul estimat"
                    >
                      <option value="">Selectează...</option>
                      <option value="under-5000">Sub 5.000 RON</option>
                      <option value="5000-10000">5.000 - 10.000 RON</option>
                      <option value="10000-25000">10.000 - 25.000 RON</option>
                      <option value="25000-50000">25.000 - 50.000 RON</option>
                      <option value="over-50000">Peste 50.000 RON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Descriere organizație *
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                      placeholder="Prezintă pe scurt organizația ta..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Obiective parteneriat *
                    </label>
                    <textarea
                      required
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                      placeholder="Ce obiective ai pentru acest parteneriat? Ce impact vrei să aveți împreună?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se trimite...
                      </>
                    ) : (
                      'Trimite Propunerea'
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Vom analiza propunerea ta și te vom contacta pentru a discuta detaliile parteneriatului.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PartnershipModal
