import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useBanner } from '../contexts/BannerContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isInitiativeOpen, setIsInitiativeOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isBannerVisible } = useBanner()

  const initiativeItems = [
    {
      name: '🌱 Mediu & Conservare',
      href: '/initiative/mediu-si-conservare',
      description: 'Plantări; ecologizări; acțiuni de protejare și conservare a mediului',
    },
    {
      name: '🎓 Educație & Dezvoltare',
      href: '/initiative/educatie-si-dezvoltare',
      description: 'Școala de vară; tabere; workshopuri; acțiuni educaționale în școli; educație non-formală',
    },
    {
      name: '🤝 Voluntariat & Comunitate',
      href: '/initiative/voluntariat-si-comunitate',
      description: 'Programe de voluntariat; implicare comunitară; inițiative pentru tineri',
    },
    {
      name: '🛶 Dezvoltare Durabilă & Turism Regenerativ',
      href: '/initiative/dezvoltare-durabila-turism-regenerativ',
      description: 'Ture cu caiacul; activități outdoor; promovarea turismului regenerativ; experiențe în natură',
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Acasă', href: '/', type: 'link' },
    { name: 'Despre Noi', href: '/despre', type: 'link' },
    { name: 'Echipa', href: '/echipa', type: 'link' },
    { name: 'Initiative', href: '/initiative/mediu-si-conservare', type: 'dropdown' },
    { name: 'Summer Camp 2027', href: '/summer-camp', type: 'link', special: true },
    { name: 'Galerie', href: '/galerie', type: 'link' },
    { name: 'Raport Activitate', href: '/raport-activitate', type: 'link' },
    { name: 'Implică-te', href: '/implica-te', type: 'link' },
    { name: 'Contact', href: '/contact', type: 'link' },
  ]

  const handleNavigation = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false)

    if (item.type === 'dropdown') {
      setIsInitiativeOpen(!isInitiativeOpen)
      return
    }

    if (item.type === 'link') {
      navigate(item.href)
    } else {
      // If we're not on home page, go to home first
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const element = document.querySelector(item.href)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      } else {
        const element = document.querySelector(item.href)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <header
      className={`fixed ${isBannerVisible ? 'top-[40px] sm:top-[48px]' : 'top-0'} left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 w-full max-w-full">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <img 
                src="/images/logo.png" 
                alt="Asociația Green Space" 
                className="h-16 w-auto"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item, index) => (
              <div key={item.name} className="relative">
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavigation(item)}
                  onMouseEnter={() => item.type === 'dropdown' && setIsInitiativeOpen(true)}
                  onMouseLeave={() => item.type === 'dropdown' && setIsInitiativeOpen(false)}
                  className={`font-medium transition-all relative flex items-center gap-1 ${
                    item.special
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:scale-105'
                      : `hover:text-emerald-600 ${isScrolled ? 'text-gray-700' : 'text-white'}`
                  }`}
                >
                  {item.name}
                  {item.type === 'dropdown' && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isInitiativeOpen ? 'rotate-180' : ''}`}
                    />
                  )}
                  {item.special && (
                    <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-0.5 rounded-full animate-pulse">
                      NOU
                    </span>
                  )}
                </motion.button>

                {/* Initiative Dropdown */}
                {item.type === 'dropdown' && (
                  <AnimatePresence>
                    {isInitiativeOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                        onMouseEnter={() => setIsInitiativeOpen(true)}
                        onMouseLeave={() => setIsInitiativeOpen(false)}
                      >
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 w-80 overflow-hidden">
                          {initiativeItems.map((initiative) => (
                            <button
                              key={initiative.href}
                              onClick={() => {
                                navigate(initiative.href)
                                setIsInitiativeOpen(false)
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-emerald-50 transition-colors"
                            >
                              <span className="block font-semibold text-gray-900 text-sm">
                                {initiative.name}
                              </span>
                              <span className="block text-xs text-gray-500 mt-0.5 leading-snug">
                                {initiative.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/implica-te')}
            className="hidden md:block bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            Donează
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${isScrolled ? 'text-gray-900' : 'text-white'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg w-full overflow-hidden"
          >
            <nav className="container mx-auto px-4 sm:px-6 py-4 flex flex-col space-y-4 w-full max-w-full">
              {navItems.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`font-medium transition-all text-left relative flex items-center justify-between ${
                      item.special
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg hover:shadow-lg'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <span>
                      {item.name}
                      {item.type === 'dropdown' && (
                        <ChevronDown
                          className={`inline w-4 h-4 ml-1 transition-transform duration-200 ${
                            isInitiativeOpen ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </span>
                    {item.special && (
                      <span className="ml-2 bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-0.5 rounded-full">
                        NOU
                      </span>
                    )}
                  </button>

                  {/* Mobile Initiative Submenu */}
                  {item.type === 'dropdown' && isInitiativeOpen && (
                    <div className="mt-2 ml-3 border-l-2 border-emerald-200 pl-4 space-y-2">
                      {initiativeItems.map((initiative) => (
                        <button
                          key={initiative.href}
                          onClick={() => {
                            navigate(initiative.href)
                            setIsMobileMenuOpen(false)
                            setIsInitiativeOpen(false)
                          }}
                          className="block w-full text-left text-sm text-gray-600 font-medium hover:text-emerald-600 transition-colors py-1.5"
                        >
                          {initiative.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  navigate('/implica-te')
                  setIsMobileMenuOpen(false)
                }}
                className="bg-primary-600 text-white px-6 py-2 rounded-full font-medium hover:bg-primary-700 transition-colors w-full"
              >
                Donează
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
