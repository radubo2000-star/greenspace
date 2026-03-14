import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useBanner } from '../contexts/BannerContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { isBannerVisible } = useBanner()

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
    { name: 'Proiecte', href: '/proiecte', type: 'link' },
    { name: 'Experiențe', href: '/experiente', type: 'link' },
    { name: 'Summer Camp 2026', href: '/summer-camp', type: 'link', special: true },
    { name: 'Galerie', href: '/galerie', type: 'link' },
    { name: 'Raport Activitate', href: '/raport-activitate', type: 'link' },
    { name: 'Implică-te', href: '/implica-te', type: 'link' },
    { name: 'Contact', href: '/contact', type: 'link' },
  ]

  const handleNavigation = (item: typeof navItems[0]) => {
    setIsMobileMenuOpen(false)
    
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
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavigation(item)}
                className={`font-medium transition-all relative ${
                  item.special
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full hover:shadow-lg hover:scale-105'
                    : `hover:text-primary-600 ${isScrolled ? 'text-gray-700' : 'text-white'}`
                }`}
              >
                {item.name}
                {item.special && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-0.5 rounded-full animate-pulse">
                    NOU
                  </span>
                )}
              </motion.button>
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
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`font-medium transition-all text-left relative ${
                    item.special
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-lg hover:shadow-lg'
                      : 'text-gray-700 hover:text-primary-600'
                  }`}
                >
                  {item.name}
                  {item.special && (
                    <span className="ml-2 bg-yellow-400 text-xs font-bold text-gray-900 px-2 py-0.5 rounded-full">
                      NOU
                    </span>
                  )}
                </button>
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
