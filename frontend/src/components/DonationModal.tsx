import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, CreditCard, Building2, Check, FileText, Download, Loader2, ArrowRight } from 'lucide-react'
import { submitDonation } from '@/services/donation-service'
import { toast } from '@/components/ui/toast'

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
  const [amount, setAmount] = useState<string>('50')
  const [customAmount, setCustomAmount] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [isRecurring, setIsRecurring] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load formular230.ro script when modal is open
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement('script')
      script.src = 'https://formular230.ro/share/7fb530299'
      script.async = true
      document.body.appendChild(script)

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      }
    }
  }, [isOpen])

  const predefinedAmounts = ['20', '50', '100', '200', '500']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)

    try {
      await submitDonation({
        amount: customAmount || amount,
        isRecurring,
        paymentMethod,
        ...formData,
      })
      
      toast.success(
        'Donație înregistrată!', 
        paymentMethod === 'card' 
          ? 'Donația ta a fost înregistrată cu succes! Verifică-ți emailul pentru detalii.'
          : 'Cererea ta a fost înregistrată! Verifică-ți emailul pentru detaliile transferului bancar.'
      )
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        })
        setCustomAmount('')
        setAmount('50')
        setIsRecurring(false)
        onClose()
      }, 3000)
    } catch (error) {
      toast.error('Eroare', error instanceof Error ? error.message : 'A apărut o eroare la procesarea donației')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedAmount = customAmount || amount

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Heart className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Donează Acum</h2>
                      <p className="text-red-100">Susține protejarea mediului</p>
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
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">Mulțumim!</h3>
                  <p className="text-xl text-gray-600 mb-2">
                    Donația ta de <span className="font-bold text-red-600">{selectedAmount} RON</span> a fost înregistrată.
                  </p>
                  <p className="text-gray-500">
                    Vei primi un email de confirmare în curând.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Amount Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Alege suma (RON)
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {predefinedAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setAmount(amt)
                            setCustomAmount('')
                          }}
                          className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                            amount === amt && !customAmount
                              ? 'bg-red-500 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {amt}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      placeholder="Altă sumă"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                      min="1"
                    />
                  </div>

                  {/* Recurring Donation */}
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                    />
                    <label htmlFor="recurring" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Donație recurentă (lunară) - Impact continuu!
                    </label>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Metodă de plată
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-red-600" />
                        <span className="text-sm font-medium">Card Bancar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === 'bank'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className="w-6 h-6 mx-auto mb-2 text-red-600" />
                        <span className="text-sm font-medium">Transfer Bancar</span>
                      </button>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nume complet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="Ion Popescu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="ion@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="+40 XXX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mesaj (opțional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors resize-none"
                        placeholder="Lasă un mesaj..."
                      />
                    </div>
                  </div>

                  {/* Bank Transfer Info */}
                  {paymentMethod === 'bank' && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Date cont bancar:</h4>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p><span className="font-medium">Beneficiar:</span> ASOCIAȚIA GREEN SPACE</p>
                        <p><span className="font-medium">CIF:</span> 48872419</p>
                        <p><span className="font-medium">IBAN RON:</span> RO24BTRLRONCRT0672472001</p>
                        <p><span className="font-medium">IBAN EUR:</span> RO95BTRLEURCRT0672472001</p>
                        <p><span className="font-medium">Bancă:</span> Banca Transilvania</p>
                        <p className="text-xs text-gray-500 mt-3">
                          * Trimite dovada plății la contact@greenspace.ro
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Documents Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Documente utile</h4>
                    </div>
                    <div className="space-y-2">
                      {/* Online Form Button - Featured */}
                      <button
                        type="button"
                        className="f230ro-lansare w-full flex items-center justify-between p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all group shadow-md hover:shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                            <FileText className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-white flex items-center gap-1">
                              ⭐ Completează Online Formularul 230
                            </p>
                            <p className="text-xs text-white/90">Cel mai rapid și simplu - Recomandat!</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                      </button>

                      <a
                        href="/documents/formular-redirectionare-3.5.pdf"
                        download
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                            <FileText className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Formular Redirecționare 3.5% (PDF)</p>
                            <p className="text-xs text-gray-500">Pentru persoane fizice - descarcă și completează</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </a>
                      
                      <a
                        href="/documents/formular-redirectionare-20.pdf"
                        download
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Formular Redirecționare 20%</p>
                            <p className="text-xs text-gray-500">Pentru persoane juridice</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </a>

                      <a
                        href="/documents/statut-asociatie.pdf"
                        download
                        className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-green-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                            <FileText className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Statut Asociație</p>
                            <p className="text-xs text-gray-500">Informații despre organizație</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      </a>
                    </div>
                  </div>

                  {/* Tax Deduction Info */}
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-amber-600" />
                      Deducere fiscală
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Persoanele fizice pot redirecționa <span className="font-bold text-amber-700">3.5%</span> din impozitul pe venit, 
                      iar persoanele juridice <span className="font-bold text-amber-700">20%</span> din impozitul pe profit către asociația noastră. 
                      Descarcă formularul corespunzător și trimite-l completat la ANAF.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Se procesează...</span>
                      </>
                    ) : (
                      <span>{paymentMethod === 'card' ? 'Donează' : 'Trimite cerere'} {selectedAmount} RON</span>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    Donațiile sunt deductibile fiscal conform legii. Vei primi certificat fiscal.
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

export default DonationModal
