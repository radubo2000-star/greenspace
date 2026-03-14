import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Youtube, Loader2 } from 'lucide-react'
import { submitContactForm } from '@/services/contact-service'
import { toast } from '@/components/ui/toast'

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await submitContactForm(formData)
      
      if (response.success) {
        toast.success('Mesaj trimis!', response.message)
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'A apărut o eroare la trimiterea mesajului'
      toast.error('Eroare', message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@asociatiagreenspace.ro',
      link: 'mailto:contact@asociatiagreenspace.ro',
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '0755 503 679',
      link: 'tel:0755503679',
    },
    {
      icon: MapPin,
      title: 'Adresă',
      value: 'Str. Vasile Alecsandri 31, Oltenita, România',
      link: '#',
    },
  ]

  const socialMedia = [
    { icon: Facebook, link: 'https://www.facebook.com/asociatiagreenspace/', color: 'hover:text-blue-600' },
    { icon: Instagram, link: 'https://www.instagram.com/asociatiagreenspace/', color: 'hover:text-pink-600' },
    { icon: Linkedin, link: 'https://www.linkedin.com/company/asociatiagreenspace/', color: 'hover:text-blue-700' },
    { icon: Youtube, link: 'https://www.youtube.com/@asociatiagreenspace9818', color: 'hover:text-sky-500' },
  ]

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-gray-50 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 w-full max-w-full">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  Nume Complet
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-semibold mb-2">
                  Subiect
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
                  Mesaj
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    Se trimite...
                    <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  </>
                ) : (
                  <>
                    Trimite Mesaj
                    <Send className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-xl">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{info.title}</h4>
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {info.value}
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Locația Noastră</h4>
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2865.231816527304!2d26.64200681170055!3d44.0992084709638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ae2dbfee46e2c9%3A0x1ad952b74589120!2sStrada%20Vasile%20Alecsandri%2031%2C%20Olteni%C8%9Ba%20915400!5e0!3m2!1sro!2sro!4v1764087326396!5m2!1sro!2sro" 
                  title="Locația Asociației Green Space pe Google Maps"
                  width="600" 
                  height="450" 
                  style={{ border: 0 }} allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
            {/* Social Media */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Urmărește-ne</h4>
              <div className="flex space-x-4">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`bg-gray-100 p-3 rounded-xl text-gray-600 ${social.color} transition-all hover:scale-110`}
                  >
                    <social.icon className="w-6 h-6" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
