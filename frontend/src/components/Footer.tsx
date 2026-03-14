import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Heart, Youtube } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const navigate = useNavigate()

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

  const footerLinks = {
    'Despre Noi': [
      { name: 'Misiune & Viziune', href: '/despre', hash: '#misiune-viziune' },
      { name: 'Echipa', href: '/despre', hash: '#echipa' },
      { name: 'Valori', href: '/despre', hash: '#valori' },
      { name: 'Raport Activitate', href: '/raport-activitate', hash: '' },
    ],
    'Activități': [
      { name: 'Proiecte', href: '/proiecte', hash: '' },
      { name: 'Experiențe', href: '/experiente', hash: '' },
      { name: 'Galerie Video', href: '/galerie', hash: '' },
      { name: 'Ture cu Caiacul', href: '/experiente', hash: '#ture-caiac' },
      { name: 'Tabere', href: '/experiente', hash: '#tabere' },
    ],
    'Implică-te': [
      { name: '⭐ Redirecționează 3.5%', href: '/implica-te', hash: '#redirectioneaza', featured: true },
      { name: 'Donează', href: '/implica-te', hash: '#doneaza' },
      { name: 'Voluntariat', href: '/implica-te', hash: '#voluntariat' },
      // { name: 'Membru', href: '/implica-te', hash: '#membru' },
      { name: 'Parteneriat', href: '/implica-te', hash: '#parteneriat' },
    ],
  }

  const handleLinkClick = (link: typeof footerLinks['Despre Noi'][0]) => {
    // If it's the formular230 link, trigger the modal instead of navigation
    if (link.hash === '#redirectioneaza') {
      // The f230ro-lansare class will be added to the button element
      return
    }
    navigate(link.href + link.hash)
  }

  const socialMedia = [
    { icon: Facebook, link: 'https://www.facebook.com/asociatiagreenspace/', name: 'Facebook' },
    { icon: Instagram, link: 'https://www.instagram.com/asociatiagreenspace/', name: 'Instagram' },
    { icon: Linkedin, link: 'https://www.linkedin.com/company/asociatiagreenspace/', name: 'LinkedIn' },
    { icon: Youtube, link: 'https://www.youtube.com/@asociatiagreenspace9818', name: 'YouTube' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-16 w-full max-w-full">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/logo.png" 
                alt="Asociația Green Space" 
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-justify">
              Suntem un grup de membri și voluntari dedicați promovării, protejării și conservării patrimoniului natural local și național.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-500" />
                <a href="mailto:contact@asociatiagreenspace.ro" className="hover:text-primary-500 transition-colors">
                  contact@asociatiagreenspace.ro
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-500" />
                <a href="tel:0755503679" className="hover:text-primary-500 transition-colors">
                  0755 503 679
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>Str. Vasile Alecsandri 31, Oltenita, România</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handleLinkClick(link)}
                      className={`transition-colors text-left ${
                        link.hash === '#redirectioneaza' 
                          ? 'text-amber-400 hover:text-amber-300 font-semibold f230ro-lansare' 
                          : 'hover:text-primary-500'
                      }`}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                © {currentYear} Asociația Green Space. Toate drepturile rezervate.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Făcut cu <Heart className="w-4 h-4 inline text-red-500" /> pentru natură
              </p>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {socialMedia.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 p-3 rounded-lg hover:bg-primary-600 transition-all hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link to="/politica-de-cookie-uri" className="hover:text-primary-500 transition-colors">
                Politică de Cookie-uri
              </Link>
              <Link to="/termeni-si-conditii" className="hover:text-primary-500 transition-colors">
                Termeni și Condiții
              </Link>
              <Link to="/galerie/admin" className="hover:text-primary-500 transition-colors opacity-50 hover:opacity-100">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
