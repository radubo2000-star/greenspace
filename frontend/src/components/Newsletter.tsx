import { useState } from 'react'
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Te rugăm să introduci o adresă de email validă')
      return
    }

    setStatus('loading')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Mulțumim! Te-ai înscris cu succes la newsletter!')
      setEmail('')
      
      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }, 1500)
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary via-green-600 to-green-700 rounded-3xl shadow-2xl p-8 md:p-12 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Rămâi la Curent cu Noutățile Noastre
              </h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Abonează-te la newsletter-ul nostru și primește cele mai recente știri despre proiectele noastre, 
                evenimente și oportunități de voluntariat.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresa ta de email"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="group relative px-8 py-4 bg-white text-primary font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        Se trimite...
                      </>
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Trimis!
                      </>
                    ) : (
                      <>
                        Abonează-te
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>

              {/* Status message */}
              {message && (
                <div
                  className={`mt-4 p-4 rounded-xl backdrop-blur-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                    status === 'success'
                      ? 'bg-green-500/20 border border-green-500/30 text-white'
                      : 'bg-red-500/20 border border-red-500/30 text-white'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm font-medium">{message}</p>
                </div>
              )}
            </form>

            {/* Privacy note */}
            <p className="text-center text-white/60 text-sm mt-6">
              🔒 Ne respectăm utilizatorii. Datele tale sunt în siguranță și nu vor fi partajate cu terți.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <span className="text-2xl">📰</span>
                </div>
                <h4 className="text-white font-semibold mb-1">Știri Exclusive</h4>
                <p className="text-white/70 text-sm">Fii primul care află despre proiectele noi</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <span className="text-2xl">🎉</span>
                </div>
                <h4 className="text-white font-semibold mb-1">Evenimente</h4>
                <p className="text-white/70 text-sm">Invitații la evenimente și activități</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
                  <span className="text-2xl">💡</span>
                </div>
                <h4 className="text-white font-semibold mb-1">Oportunități</h4>
                <p className="text-white/70 text-sm">Descoperă cum te poți implica</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
