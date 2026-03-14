import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Check, Shield, Users, Vote, Loader2 } from 'lucide-react'
import { submitMemberApplication } from '../services/member-service'
import { toast } from '../components/ui/toast'

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
}

const MemberModal = ({ isOpen, onClose }: MemberModalProps) => {
  const [membershipType, setMembershipType] = useState<'individual' | 'family' | 'student'>('individual')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cnp: '',
    occupation: '',
    motivation: '',
    agreeTerms: false,
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const membershipPlans = [
    {
      type: 'student' as const,
      title: 'Student',
      price: '50',
      description: 'Pentru studenți și elevi',
      features: ['Acces la toate evenimentele', 'Materiale educaționale', 'Certificat de membru', 'Reduceri la evenimente'],
    },
    {
      type: 'individual' as const,
      title: 'Individual',
      price: '100',
      description: 'Pentru persoane fizice',
      features: ['Toate beneficiile Student', 'Drept de vot în AGA', 'Newsletter exclusiv', 'Invitații la evenimente speciale'],
    },
    {
      type: 'family' as const,
      title: 'Familie',
      price: '200',
      description: 'Pentru întreaga familie',
      features: ['Toate beneficiile Individual', 'Până la 4 membri', 'Activități pentru copii', 'Prioritate la evenimente'],
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)

    try {
      await submitMemberApplication({ membershipType, ...formData })
      
      toast.success('Cerere trimisă!', 'Cererea ta a fost trimisă cu succes! Verifică-ți emailul pentru detalii despre plată.')
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          cnp: '',
          occupation: '',
          motivation: '',
          agreeTerms: false,
        })
        onClose()
      }, 3000)
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'A apărut o eroare la trimiterea cererii')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPlan = membershipPlans.find((p) => p.type === membershipType)!

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
              <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Devino Membru</h2>
                      <p className="text-purple-100">Implică-te activ în decizii</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
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
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Bine ai venit în echipă!</h3>
                  <p className="text-xl text-gray-600 mb-2">
                    Cererea ta de membru <span className="font-bold text-purple-600">{selectedPlan.title}</span> a fost înregistrată.
                  </p>
                  <p className="text-gray-500">
                    Vei primi instrucțiuni de plată și documentele necesare pe email.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Membership Plans */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Alege tipul de membru
                    </label>
                    <div className="grid md:grid-cols-3 gap-4">
                      {membershipPlans.map((plan) => (
                        <button
                          key={plan.type}
                          type="button"
                          onClick={() => setMembershipType(plan.type)}
                          className={`p-6 rounded-2xl border-2 transition-all text-left ${
                            membershipType === plan.type
                              ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-bold text-gray-900">{plan.title}</h3>
                            {membershipType === plan.type && (
                              <Check className="w-6 h-6 text-purple-600" />
                            )}
                          </div>
                          <div className="mb-3">
                            <span className="text-3xl font-bold text-purple-600">{plan.price}</span>
                            <span className="text-gray-500"> RON/an</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                          <ul className="space-y-2">
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <Check className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Benefits Highlight */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-purple-600" />
                      Beneficii membru
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <Vote className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Drept de vot</h4>
                          <p className="text-xs text-gray-600">Participă la decizii importante</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Comunitate</h4>
                          <p className="text-xs text-gray-600">Networking cu membri activi</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-purple-600 mt-1" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">Impact direct</h4>
                          <p className="text-xs text-gray-600">Contribuie la proiecte concrete</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nume complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Ion Popescu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CNP *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.cnp}
                        onChange={(e) => setFormData({ ...formData, cnp: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="1234567890123"
                        maxLength={13}
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="ion@example.com"
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
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="+40 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Adresă completă *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Str. Exemplu nr. 1, Sector 1"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Oraș *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="București"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ocupație
                      </label>
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Ex: Student, Inginer, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      De ce vrei să devii membru? *
                    </label>
                    <textarea
                      required
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      placeholder="Spune-ne ce te motivează să devii membru al asociației..."
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                      Sunt de acord cu <a href="#" className="text-purple-600 hover:underline">Statutul asociației</a> și <a href="#" className="text-purple-600 hover:underline">Regulamentul intern</a>. Confirm că informațiile furnizate sunt corecte și complete. *
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Se trimite...
                      </>
                    ) : (
                      `Trimite Cererea - ${selectedPlan.price} RON/an`
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    După aprobare, vei primi factura și instrucțiunile de plată. Calitatea de membru devine activă după achitarea cotizației.
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

export default MemberModal
