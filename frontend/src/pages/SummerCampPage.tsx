import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { 
  Calendar, MapPin, Users, Clock, Tent, Shield, 
  Phone, Mail, Globe, Facebook, Instagram, Youtube, Music,
  Mountain, Waves, Target, Leaf, Flame, PartyPopper, Gamepad2,
  CheckCircle2, AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { calculateYearsOfActivity } from '../utils/calculateYears'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

const SummerCampPage = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const activities = [
    {
      icon: Waves,
      title: 'Caiac pe Lacul Siriu',
      items: [
        'Sesiuni de inițiere în caiac (nu este necesar să știi să înoți)',
        'Instructori cu experiență și echipamente de calitate',
        'Echipamente fabricate în UE sau conforme standardelor europene',
        'Explorarea liniștită a unuia dintre cele mai frumoase lacuri montane din România'
      ]
    },
    {
      icon: Mountain,
      title: 'Drumeție Montană',
      items: [
        'Traseu prietenos, accesibil tuturor participanților',
        'Ghidaj profesionist din partea echipei Green Space',
        'Picnic în aer liber, la stână',
        'Povești despre natură, geografie și ecologie chiar pe potecă'
      ]
    },
    {
      icon: Target,
      title: 'Tir cu Arcul',
      items: [
        'Activitate relaxantă și antrenantă',
        'Competiție amicală pentru cei pasionați de precizie și concentrare'
      ]
    },
    {
      icon: Leaf,
      title: 'Workshop Turism Sustenabil',
      items: [
        'Ce înseamnă ecoturismul în România?',
        'Legislație esențială și exemple de bună practică',
        'Dezbateri interactive'
      ]
    },
    {
      icon: Flame,
      title: 'Foc de Tabără',
      items: [
        'Seară de relaxare cu muzică la chitară și socializare',
        'Spațiu pentru schimb de idei și voie bună',
        'În fiecare seară'
      ]
    },
    {
      icon: PartyPopper,
      title: 'Petrecere Finală',
      items: [
        'Un moment de celebrare a noilor prietenii și amintiri',
        'Muzică, dans și bucurie în mijlocul naturii, pe malul lacului'
      ]
    },
    {
      icon: Gamepad2,
      title: 'Alte Activități Distractive',
      items: [
        'Jocuri de societate',
        'Biliard, darts, șah, remy',
        'Mici competiții tematice'
      ]
    }
  ]

  const accommodationFeatures = [
    'Locație prietenoasă cu mediul - 100% energie verde (regenerabilă)',
    'Apă de izvor certificată',
    'Domeniu de 12 hectare amenajat pe malul lacului',
    'Unități de cazare moderne',
    'Camere de 2, 3 sau 4 persoane',
    'Căsuțe cu vedere spre lac pentru 2 persoane',
    '3 mese/zi - stil tradițional',
    'Produse locale, proaspete și sănătoase'
  ]

  const priceIncludes = [
    'Cazare 4 nopți',
    '3 mese/zi (mic dejun, prânz, cină)',
    'Toate activitățile menționate',
    'Echipamente pentru caiac și tir cu arcul',
    'Ghidaj, siguranță, materiale suport',
    'Workshop-uri și sesiuni educaționale',
    'Kit de participant & surprize (frontală, încălțări de apă, lightstick, survivor kit)'
  ]

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/images/experiences/5caiac.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-emerald-800/85 to-green-700/80 z-10" />
        
        <div className="container mx-auto px-4 relative z-20 py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Summer Green Camp
            </h1>
            <p className="text-2xl md:text-3xl mb-8 text-white">
              Aventură, Natură, Comunitate
            </p>
            <p className="text-xl mb-8 text-green-50 max-w-3xl mx-auto">
              O experiență de conectare cu natura pe lacul Siriu 💚
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center mb-8 text-white">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5" />
                <span>Lacul Siriu, Munții Buzăului</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span>5 zile / 4 nopți</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="w-5 h-5" />
                <span>30-50 participanți</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-white text-green-600 hover:bg-green-50 shadow-xl text-lg px-8 py-6"
              >
                <Link to="/contact">
                  <Calendar className="w-5 h-5 mr-2" />
                  Înscrie-te Acum
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 text-lg px-8 py-6"
              >
                <a href="tel:0755503679">
                  <Phone className="w-5 h-5 mr-2" />
                  0755 503 679
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Ce este Summer Green Camp */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">
              Ce este Summer Green Camp?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p className="text-xl leading-relaxed text-justify">
                Summer Green Camp este mai mult decât o tabără – este o <strong>experiență ideală de conectare cu natura</strong>, 
                prin explorare activă și învățare.
              </p>
              <p className="text-lg leading-relaxed text-justify">
                <strong>Lacul Siriu</strong> este un lac de acumulare spectaculos, format pe râul Buzău, situat în Munții Buzăului. 
                Înconjurat de păduri dese și peisaje montane, oferă un cadru natural ideal pentru activități recreative precum 
                caiac, drumeții și relaxare. Apa limpede și liniștea locului creează o atmosferă perfectă pentru conectare cu natura.
              </p>
              <p className="text-lg leading-relaxed text-justify">
                Într-un cadru spectaculos, timp de <strong>5 zile</strong>, vei trăi momente autentice alături de o echipă tânără, 
                dedicată, formată din <strong>profesioniști în turism sustenabil</strong>, formatori, salvamari, ghizi autorizați, 
                instructori de caiac, studenți pasionați de ecoturism și voluntari cu experiență.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activități */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Activitățile Taberei
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {activities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <activity.icon className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {activity.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {activity.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cazare și Facilități */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Condiții de Cazare
            </h2>
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Tent className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      <a 
                        href="https://www.izvorulbucuriei.ro/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-green-600 transition-colors"
                      >
                        Complex Turistic Izvorul Bucuriei
                      </a>
                    </h3>
                    <p className="text-gray-700">
                      Partenerii noștri împărtășesc aceleași valori cu echipa noastră: <strong>conservarea și protejarea mediului natural</strong>.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {accommodationFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Despre Echipa Green Space */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Despre Echipa Green Space
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 mb-8 text-justify">
                      Suntem o organizație dedicată <strong>protejării și conservării mediului natural</strong>, iar dintre 
                      activitățile noastre principale sunt <strong>educația ecologică</strong> și promovarea <strong>turismului sustenabil</strong>.
                    </p>
                  </div>
                </div>
                
                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Portofoliul nostru */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Portofoliul nostru</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Peste 6 ani de experiență în lucrul cu tinerii</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Peste 150 de elevi implicați în acțiuni de voluntariat</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">6 tabere de inițiere în caiac</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">4 tabere montane</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Campări în mediul natural</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Peste 6 ani de experiență în programe educaționale</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calificările echipei */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Calificările echipei</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Formatori</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Ghizi de turism local</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Ghizi de turism național</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Instructori agrement cu caiacul</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Salvamari</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Basic Life Support (prim ajutor)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Specialiști în activități outdoor</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Rezerviști din structurile de apărare</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-justify">Instructori de chitară</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Preț și Ce Include */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Costul Taberei
            </h2>
            <Card className="border-2 border-green-500">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <p className="text-lg text-gray-700 mb-2">Preț total</p>
                  <p className="text-5xl font-bold text-green-600 mb-2">La cerere</p>
                  <p className="text-gray-600">per persoană</p>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Include:</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {priceIncludes.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Număr de locuri limitat</strong> – rezervările se fac în ordinea înscrierii
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Vârsta minimă</strong> pentru participare este de 11 ani. Tabăra este concepută pentru 
                      tineri independenți, fără însoțitori, pentru a dezvolta autonomia și abilitățile sociale
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">
                      <strong>Transportul</strong> se achită separat, în funcție de solicitări
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* De ce să participi */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-gray-900">
              De ce să participi?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="text-left">
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Experiență autentică
                  </h3>
                  <p className="text-gray-700">
                    Activă și educativă, în mijlocul naturii spectaculoase
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Echipă profesionistă
                  </h3>
                  <p className="text-gray-700">
                    Atentă la siguranță și detalii, cu peste {calculateYearsOfActivity()} ani experiență
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Peisaje spectaculoase
                  </h3>
                  <p className="text-gray-700">
                    Activități variate în Munții Buzăului, la Lacul Siriu
                  </p>
                </CardContent>
              </Card>
              <Card className="text-left">
                <CardContent className="p-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Prietenii noi
                  </h3>
                  <p className="text-gray-700">
                    Momente de neuitat și conexiuni autentice
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact și Înscrieri */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Înscrieri & Detalii
            </h2>
            <p className="text-xl mb-12 text-green-50">
              Contactează-ne pentru a-ți rezerva locul la Summer Green Camp 2027
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <Phone className="w-8 h-8 mb-3 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Telefon & WhatsApp</h3>
                  <a href="tel:0755503679" className="text-lg hover:underline">
                    0755 503 679
                  </a>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <Mail className="w-8 h-8 mb-3 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <a href="mailto:contact@greenspace.ro" className="text-lg hover:underline">
                    contact@greenspace.ro
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <Globe className="w-8 h-8 mb-3 mx-auto" />
                  <h3 className="text-xl font-bold mb-2">Website</h3>
                  <a 
                    href="https://www.asociatiagreenspace.ro" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg hover:underline"
                  >
                    www.asociatiagreenspace.ro
                  </a>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a 
                href="https://www.facebook.com/asociatiagreenspace" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
              <a 
                href="https://www.instagram.com/asociatiagreenspace" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.youtube.com/@asociatiagreenspace9818" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Youtube className="w-5 h-5" />
                <span>YouTube</span>
              </a>
              <a 
                href="https://www.tiktok.com/@greenspace.oltenita" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Music className="w-5 h-5" />
                <span>TikTok</span>
              </a>
            </div>

            <Button 
              asChild
              size="lg" 
              className="bg-white text-green-600 hover:bg-green-50 shadow-xl text-lg px-8 py-6"
            >
              <Link to="/contact">
                <Calendar className="w-5 h-5 mr-2" />
                Înscrie-te Acum
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default SummerCampPage
