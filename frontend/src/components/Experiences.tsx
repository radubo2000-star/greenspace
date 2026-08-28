import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Waves, Tent, Users, Shield, MapPin, Clock, ChevronRight, Mail, Phone, Package, Info, X, Mountain } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getYearsOfActivityFormatted, calculateYearsOfActivity } from '../utils/calculateYears'

const Experiences = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedExperience, setSelectedExperience] = useState<any>(null)

  const categories = [
    { id: 'all', name: 'Toate', icon: ChevronRight, hash: '' },
    { id: 'summer-camp', name: 'Summer Green Camp', icon: Tent, hash: 'summer-camp' },
    { id: 'kayak', name: 'Ture cu Caiacul', icon: Waves, hash: 'ture-caiac' },
    { id: 'hiking', name: 'Drumeții montane', icon: Mountain, hash: 'drumetii' },
    { id: 'camps', name: 'Alte Tabere', icon: Tent, hash: 'tabere' },
  ]

  const experiences = [
    {
      id: 7,
      category: 'summer-camp',
      title: 'Summer Green Camp',
      description: 'Aventură, Natură, Comunitate - O experiență de conectare cu natura pe lacul Siriu 💚',
      image: '/images/experiences/eco.jpg',
      location: 'Lacul Siriu, Complex Turistic Izvorul Bucuriei',
      duration: '27-31 iulie 2027 (5 zile)',
      difficulty: 'Toate nivelurile (min. 11 ani)',
      price: 'Preț la cerere',
      featured: true,
      features: [
        '🚣‍♂️ Caiac pe Lacul Siriu - Sesiuni de inițiere',
        '🥾 Drumeție montană cu ghid profesionist',
        '🏹 Tir cu arcul - Competiție amicală',
        '🌱 Workshop turism sustenabil',
        '🔥 Foc de tabără în fiecare seară',
        '🎉 Petrecere în ultima seară',
        '🏡 Cazare modernă pe malul lacului',
        '🍽️ 3 mese/zi - produse locale',
        `👨‍🏫 Echipă cu ${getYearsOfActivityFormatted()} ani experiență`,
        '🎁 Kit participant & surprize',
      ],
      detailedInfo: {
        participants: '30-50 participanți',
        ageLimit: 'Vârsta minimă 11 ani - tineri independenți',
        accommodation: 'Camere 2-4 persoane și căsuțe cu vedere la lac',
        meals: '3 mese/zi - stil tradițional, produse locale',
        transport: 'Se achită separat',
        contact: {
          phone: '0755503679',
          email: 'contact@greenspace.ro',
          website: 'www.asociatiagreenspace.ro',
        },
      },
    },
    // EXPERIENȚA 1: Ture cu caiacul de o zi
    {
      id: 1,
      category: 'kayak',
      title: 'Ture cu Caiacul de o Zi',
      description: 'Te invităm să experimentezi agrementul cu caiacul, pe râul Argeș și fluviul Dunărea, alături de oameni experimentați și iubitori de natură. Vei parcurge zonele sălbatice ale Argeșului și Dunării, arii naturale protejate, unde vegetația și fauna ne vor oferi peisaje spectaculoase.',
      image: '/images/experiences/10caiacepe arges.jpg',
      location: 'Municipiul Oltenița - 45 min de București',
      duration: 'O zi completă',
      difficulty: 'Toate nivelurile',
      price: 'Preț variabil în funcție de pachet',
      featured: true,
      features: [
        '🚣 Echipament complet inclus',
        '👨‍🏫 Ghizi experimentați și iubitori de natură',
        '🌿 Arii naturale protejate - peisaje spectaculoase',
        '🦅 Observarea faunei și florei locale',
        '🚗 Transport din București disponibil (opțional)',
        '📸 Fotografii memorabile garantate',
      ],
      packages: [
        {
          name: 'Pachet 1',
          description: 'Cea mai scurtă tură a noastră. Aici ai ocazia să vezi, până în locul de confluență, un biotop foarte frumos format pe ruinele proiectului canalului navigabil Dunăre-București.',
          duration: '2-3 ore',
          distance: '~8 km',
          difficulty: 'Ușor',
        },
        {
          name: 'Pachet 2',
          description: 'Traseul, atât cel de pe Argeș cât și cel de pe Dunăre, este spectaculos și cu siguranță vom întâlni câteva specii de păsări din rândul celor protejate.',
          duration: '3-4 ore',
          distance: '~12 km',
          difficulty: 'Ușor-Mediu',
        },
        {
          name: 'Pachet 3 - Recomandat Începătorilor',
          description: 'Acesta este traseul pe care îl recomandăm tuturor începătorilor deoarece în prima parte a traseului înveți foarte bine să stăpânești caiacul iar în a doua parte ne vom bucura de peisajele frumoase ale zonei. Depășim adesea 5h de padelat.',
          duration: '5+ ore',
          distance: '16 km',
          difficulty: 'Mediu',
          recommended: true,
        },
        {
          name: 'Pachet 4',
          description: 'Traseul este foarte frumos, necesită o zi întreagă, lansarea și recuperarea se va face direct din Dunăre. Vom străbate rezervații naturale (ostroave), foarte frumoase și populate cu vegetație și faună din rândul celor protejate.',
          duration: 'O zi întreagă',
          distance: '~20 km',
          difficulty: 'Mediu',
        },
        {
          name: 'Pachet 5 - Ideal Începătorilor',
          description: 'Un traseu mediu ca efort dar ideal începătorilor deoarece avem la dispoziție în jur de 8km ca să exersăm. Vom pădela aproximativ 22km și ne vom lansa la apă din canalul Dorobanțu. Confluența acestuia cu Dunărea este spectaculoasă deoarece imediat după este Ostrovul Haralambie, arie protejată de interes național.',
          duration: '6-7 ore',
          distance: '22 km',
          difficulty: 'Mediu',
        },
        {
          name: 'Pachet 6 - Necesită Experiență',
          description: 'Traseu lung, de dificultate medie. Este unul din traseele noastre preferate, străbatem zone sălbatice, cu vegetație spectaculoasă și faună densă. Recuperarea va avea loc în port, unde putem consuma o bere și să stăm la povești.',
          duration: '7-8 ore',
          distance: '~25 km',
          difficulty: 'Mediu-Avansat',
          experienceRequired: true,
        },
      ],
    },
    // EXPERIENȚA 2: Ture cu caiacul de 2 zile (campare)
    {
      id: 2,
      category: 'kayak',
      title: 'Ture cu Caiacul de 2 Zile (Campare)',
      description: 'Te invităm să experimentezi agrementul cu caiacul și camparea, pe malurile sălbatice ale fluviului Dunărea, alături de oameni experimentați și iubitori de natură. Vom campa în locuri izolate și vom desfășura și alte activități, mulate pe starea grupului.',
      image: '/images/experiences/2dunare.jpg',
      location: 'Fluviul Dunărea - plecare din Oltenița',
      duration: '2 zile cu campare',
      difficulty: 'Mediu - Avansat',
      price: 'Preț variabil în funcție de pachet',
      featured: true,
      features: [
        '⛺ Campare pe malurile sălbatice ale Dunării',
        '🎒 Toate echipamentele necesare asigurate',
        '🌙 Experiență unică în sălbăticie',
        '🔥 Foc de tabără și activități de seară',
        '📚 Workshop-uri: orientare, noduri, supraviețuire',
        '🚗 Transport din București disponibil (opțional)',
        '🍽️ Mese pregătite în natură',
      ],
      packages: [
        {
          name: 'Pachet 1 - Relaxare și Învățare',
          description: 'Acest traseu implică dormitul la cort pe malurile sălbatice ale Dunării. În prima zi vom depune ceva efort, vom pădela aproximativ 24 de km dar a doua zi vom avea timp să stăm la soare și să ne relaxăm, timpul va fi suficient încât să desfășurăm și ceva activități în zona de campare (învățăm orientare, noduri, etc).',
          day1: '24 km padelat',
          day2: 'Relaxare și activități educative',
          difficulty: 'Mediu',
        },
        {
          name: 'Pachet 2 - Experiență Echilibrată',
          description: 'Acest traseu implică dormitul la cort pe malurile sălbatice ale Dunării. Traseul implică două zile a câte 22 km de padelat și vom avea timp suficient să ne bucurăm de experiența unică oferită. Zona este foarte frumoasă, locul de campare este foarte bine poziționat și cu siguranță vei rămâne plăcut impresionat.',
          day1: '22 km padelat',
          day2: '22 km padelat',
          difficulty: 'Mediu',
        },
        {
          name: 'Pachet 3 - Experiență Completă',
          description: 'Traseu cu campare pe malurile sălbatice ale Dunării. Experiența este unică, solicitantă, vom vedea tot ce se poate pe Dunăre pe sectorul Giurgiu - Oltenița. Dacă îți plac drumeții cu campare, te invităm să încerci o experiență similară dar pe apă. Locul de campare este bine poziționat, undeva la jumătatea traseului.',
          route: 'Sectorul Giurgiu - Oltenița',
          camping: 'La jumătatea traseului',
          difficulty: 'Mediu-Avansat',
        },
        {
          name: 'Pachet 4 - Cel Mai Frumos Traseu',
          description: 'Traseu cu campare pe malurile sălbatice ale Dunării. Este un traseu cu grad ridicat de efort, deoarece a doua zi avem ceva mai mult de padelat. Însă este și cel mai frumos, noi îl practicăm de câte ori avem ocazia, în scop de relaxare. Vom trece prin trei arii naturale protejate, vom întâlni pelicani și cormorani, pe lângă alte specii protejate. Vom campa la lumina lunii în sălbăticie.',
          protectedAreas: '3 arii naturale protejate',
          wildlife: 'Pelicani, cormorani și alte specii protejate',
          difficulty: 'Avansat',
          recommended: true,
        },
      ],
    },
    // EXPERIENȚA 3: Închiriere echipamente caiac
    {
      id: 3,
      category: 'kayak',
      title: 'Închiriere Echipamente Caiac',
      description: 'Îți oferim posibilitatea să îți organizezi singur un eveniment ce implică agrementul cu caiacul. Contactează-ne și îți punem la dispoziție contra cost toate echipamentele necesare pentru grupuri mari.',
      image: '/images/experiences/4dunare.webp',
      location: 'Municipiul Oltenița',
      duration: 'Flexibil - în funcție de nevoile tale',
      difficulty: 'Personalizat',
      price: 'Preț la cerere',
      features: [
        '🚐 Van 4x4, 8+1 locuri',
        '🚛 Remorcă caiace pentru 16 caiace',
        '🛶 16 caiace complet echipate',
        '⛺ Echipamente campare pentru 16 persoane',
        '🎒 Corturi + saci de dormit + saltele',
        '💡 Frontale + lămpi + vesela campare',
        '🔥 Butelii cu aragaz',
        '📋 Consultanță pentru organizarea evenimentului',
      ],
      rentalInfo: {
        maxCapacity: '16 persoane',
        transport: 'Van 4x4 disponibil',
        camping: 'Echipament complet pentru 16 persoane',
        kayaks: '16 caiace complet echipate',
      },
    },
    // EXPERIENȚA PREMIUM: Kayak Trail Giurgiu - Oltenița
    {
      id: 4,
      category: 'kayak',
      title: 'Kayak Trail: Giurgiu - Oltenița',
      description: 'Pornește într-o aventură de două zile cu caiacul pe Dunăre, cu plecare din Giurgiu și recuperare în Oltenița. Traseul te poartă prin arii sălbatice din rețeaua Natura 2000, printre ostroave izolate, peisaje neatinse și zeci de specii de păsări protejate.',
      image: '/images/experiences/giurgiu-oltenita-kaiak.jpeg',
      routeMap: '/images/experiences/giurgiu-oltenita.jpg',
      location: 'Giurgiu → Oltenița (Dunărea de Jos)',
      duration: '2 zile / 1 noapte',
      difficulty: 'Mediu-Ridicat',
      price: 'Preț la cerere',
      featured: true,
      premium: true,
      features: [
        '🏨 Cazare la FISHERMAN\'S MEETING (Bulgaria)',
        '🌿 Arii sălbatice din rețeaua Natura 2000',
        '🏝️ Ostroave izolate și peisaje uimitoare',
        '🦅 Zeci de specii de păsări protejate',
        '👨‍🏫 Ghidaj profesionist pe tot parcursul',
        '🚣 Echipamente complete incluse',
        '🌅 Experiență autentică pe Dunărea de Jos',
        '🧘 Loc perfect pentru odihnă și relaxare',
        '📸 Natură pură și liniște deplină',
      ],
      detailedInfo: {
        highlights: [
          '🗺️ Traseu prin arii protejate Natura 2000',
          '🏨 Cazare confortabilă la Fisherman\'s Meeting (BG)',
          '🌊 Experiență autentică pe Dunărea de Jos',
          '🦢 Observarea faunei sălbatice protejate',
          '🌅 Peisaje spectaculoase și izolare completă',
        ],
        included: 'Ghidaj profesionist, echipamente complete de caiac, cazare la Fisherman\'s Meeting',
        notes: [
          '✨ Experiența ideală pentru cei care caută natură pură, liniște și aventură autentică',
          '🌤️ Evenimentul poate fi anulat sau amânat în funcție de condițiile meteo',
          '🚗 Transport din București disponibil la cerere',
          '📋 Detalii complete și rezervări la contact',
        ],
        contact: {
          phone: '0755503679',
          email: 'contact@asociatiagreenspace.ro',
          website: 'www.kayakromania.ro',
        },
      },
    },
    // EXPERIENȚA PREMIUM: Kayak Trail Oltenița - Călărași
    {
      id: 5,
      category: 'kayak',
      title: 'Kayak Trail: Oltenița - Călărași',
      description: 'Pornește într-o aventură de două zile cu caiacul pe Dunăre, cu plecare din Oltenița și recuperare în Călărași. Traseul te poartă prin arii sălbatice din rețeaua Natura 2000, printre ostroave izolate, peisaje neatinse și zeci de specii de păsări protejate.',
      image: '/images/experiences/pe dunare.jpg',
      routeMap: '/images/experiences/oltenita-calarasi.jpg', // Poți schimba cu harta specifică pentru Oltenița-Călărași
      location: 'Oltenița → Călărași (Dunărea de Jos)',
      duration: '2 zile / 1 noapte',
      difficulty: 'Mediu-Ridicat',
      price: 'Preț la cerere',
      featured: true,
      premium: true,
      features: [
        '🏨 Cazare la Danube Pearl (Bulgaria)',
        '🌿 Arii sălbatice din rețeaua Natura 2000',
        '🏝️ Ostroave izolate și peisaje uimitoare',
        '🦅 Zeci de specii de păsări protejate',
        '👨‍🏫 Ghidaj profesionist pe tot parcursul',
        '🚣 Echipamente complete incluse',
        '🌅 Experiență autentică pe Dunărea de Jos',
        '🧘 Loc perfect pentru odihnă și relaxare',
        '📸 Natură pură și liniște deplină',
      ],
      detailedInfo: {
        highlights: [
          '🗺️ Traseu prin arii protejate Natura 2000',
          '🏨 Cazare confortabilă la Danube Pearl (BG)',
          '🌊 Experiență autentică pe Dunărea de Jos',
          '🦢 Observarea faunei sălbatice protejate',
          '🌅 Peisaje spectaculoase și izolare completă',
        ],
        included: 'Ghidaj profesionist, echipamente complete de caiac, cazare la Danube Pearl',
        notes: [
          '✨ Experiența ideală pentru cei care caută natură pură, liniște și aventură autentică',
          '🌤️ Evenimentul poate fi anulat sau amânat în funcție de condițiile meteo',
          '🚗 Transport din București disponibil la cerere',
          '📋 Detalii complete și rezervări la contact',
        ],
        contact: {
          phone: '0755503679',
          email: 'contact@asociatiagreenspace.ro',
          website: 'www.kayakromania.ro',
        },
      },
    },
    // DRUMEȚII MONTANE
    {
      id: 11,
      category: 'hiking',
      title: 'Drumeții montane de o zi',
      description: 'Explorează frumusețea munților României alături de ghizi experimentați. Trasee adaptate pentru toate nivelurile de pregătire, prin peisaje spectaculoase și locuri pitorești.',
      image: '/images/experiences/hiking-day.jpg',
      location: 'Diverse trasee montane',
      duration: 'O zi',
      difficulty: 'Variabil - de la ușor la mediu',
      price: 'Preț la cerere',
      featured: true,
      features: [
        '🥾 Trasee adaptate pentru toate nivelurile',
        '👨‍🏫 Ghizi montani experimentați',
        '🏔️ Peisaje spectaculoase',
        '📸 Opriri foto la puncte panoramice',
        '🌿 Educație despre flora și fauna locală',
        '🚗 Transport organizat din București',
        '🎒 Recomandări echipament necesar',
      ],
    },
    {
      id: 12,
      category: 'hiking',
      title: 'Drumeții montane cu campare',
      description: 'Experiență completă de drumeție montană cu campare în natură. Perfectă pentru cei care vor să se deconecteze și să se reconecteze cu natura.',
      image: '/images/experiences/hiking-camping.jpg',
      location: 'Diverse trasee montane',
      duration: '2-3 zile',
      difficulty: 'Mediu - Avansat',
      price: 'Preț la cerere',
      featured: true,
      features: [
        '⛺ Campare în locații spectaculoase',
        '🏔️ Trasee prin munții României',
        '🎒 Echipament de campare inclus',
        '🔥 Foc de tabără și povești sub stele',
        '👨‍🏫 Ghizi montani profesioniști',
        '🌄 Răsărituri și apusuri memorabile',
        '🍽️ Mese pregătite în natură',
        '📚 Tehnici de orientare și supraviețuire',
      ],
    },

    {
      id: 8,
      category: 'camps',
      title: 'Tabără Inițiere în caiac',
      description: 'Tabără de weekend dedicată inițierii în caiac pentru copii și tineri. O experiență completă care combină învățarea tehnicilor de bază cu aventura pe apă.',
      image: '/images/experiences/caiac-initiere.jpeg',
      location: 'Complex Turistic Izvorul Bucuriei',
      duration: '2 zile / 1 noapte',
      difficulty: 'Începători',
      price: '1.400 lei',
      features: [
        '🚣 Inițiere în caiac cu instructori certificați',
        '🏨 Cazare confortabilă',
        '🍽️ Masă completă (mic dejun, prânz, cină)',
        '🎒 Echipament complet de caiac inclus',
        '🌲 Activități outdoor și educație ecologică',
        '🛡️ Asigurare de sănătate',
        '👨‍🏫 Supraveghere permanentă',
        '📜 Certificate de participare',
      ],
    },
  ]

  const filteredExperiences = selectedCategory === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === selectedCategory)

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Siguranță și Experiență',
      description: `Echipa noastră are peste ${calculateYearsOfActivity()} ani de experiență, deținem toate echipamentele necesare, iar înotul nu este obligatoriu pentru a participa.`,
    },
    {
      icon: Users,
      title: 'Susține Misiunea Noastră',
      description: 'Participând la experiențele noastre, contribui direct la proiectele de conservare și educație ecologică.',
    },
    {
      icon: MapPin,
      title: 'Locații Spectaculoase',
      description: 'La doar 45 de minute de București, în Municipiul Oltenița, unde Argeșul se varsă în Dunăre.',
    },
  ]



  return (
    <section id="experiences" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Experiențele noastre
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ture cu caiacul și tabere de vară - experiențe care susțin misiunea noastră de protejare a mediului
          </p>
        </motion.div>

        {/* Safety Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {safetyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-justify">{feature.description}</p>
            </motion.div>
          ))}
        </div>



        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12 scroll-mt-20"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              id={category.hash}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Experiences Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {experience.premium && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ PREMIUM
                    </span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                    {experience.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-justify">{experience.description}</p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                    <span>
                      {experience.location.includes('Izvorul Bucuriei') ? (
                        <>
                          {experience.location.split('Complex Turistic Izvorul Bucuriei')[0]}
                          <a 
                            href="https://www.izvorulbucuriei.ro/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-green-600 transition-colors underline"
                          >
                            Complex Turistic Izvorul Bucuriei
                          </a>
                        </>
                      ) : (
                        experience.location
                      )}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary-600" />
                    <span>{experience.duration}</span>
                  </div>
                  {experience.price && (
                    <div className="flex items-center text-primary-600 text-sm font-semibold">
                      <span className="mr-2">💰</span>
                      <span>{experience.price}</span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {experience.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <ChevronRight className="w-4 h-4 mr-2 text-primary-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {experience.id === 7 ? (
                  <div className="flex gap-2">
                    <Link 
                      to="/summer-camp"
                      className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 text-center"
                    >
                      Detalii
                    </Link>
                    <Link 
                      to="/contact"
                      className="flex-1 bg-green-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-green-700 transition-all hover:scale-105 text-center"
                    >
                      Înscrie-te
                    </Link>
                  </div>
                ) : experience.packages || experience.detailedInfo?.highlights || experience.routeMap ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedExperience(experience)}
                      className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      {experience.packages ? (
                        <>
                          <Package className="w-4 h-4" />
                          Vezi Pachete
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          Vezi Traseu
                        </>
                      )}
                    </button>
                    <Link 
                      to="/contact"
                      className="flex-1 bg-green-600 text-white px-4 py-3 rounded-full font-semibold hover:bg-green-700 transition-all hover:scale-105 text-center"
                    >
                      Contact
                    </Link>
                  </div>
                ) : (
                  <Link 
                    to="/contact"
                    className="block w-full bg-primary-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 text-center"
                  >
                    Solicită Ofertă
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal pentru Pachete */}
        {selectedExperience && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-3xl flex justify-between items-start z-10">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{selectedExperience.title}</h3>
                  <p className="text-primary-100">{selectedExperience.description}</p>
                </div>
                <button
                  onClick={() => setSelectedExperience(null)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Info General */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <MapPin className="w-5 h-5 text-primary-600 mb-2" />
                    <p className="text-sm text-gray-600">Locație</p>
                    <p className="font-semibold text-gray-900">
                      {selectedExperience.location.includes('Izvorul Bucuriei') ? (
                        <>
                          {selectedExperience.location.split('Complex Turistic Izvorul Bucuriei')[0]}
                          <a 
                            href="https://www.izvorulbucuriei.ro/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-green-600 transition-colors underline"
                          >
                            Complex Turistic Izvorul Bucuriei
                          </a>
                        </>
                      ) : (
                        selectedExperience.location
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <Clock className="w-5 h-5 text-primary-600 mb-2" />
                    <p className="text-sm text-gray-600">Durată</p>
                    <p className="font-semibold text-gray-900">{selectedExperience.duration}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <Shield className="w-5 h-5 text-primary-600 mb-2" />
                    <p className="text-sm text-gray-600">Dificultate</p>
                    <p className="font-semibold text-gray-900">{selectedExperience.difficulty}</p>
                  </div>
                </div>

                {/* Premium Highlights */}
                {selectedExperience.premium && selectedExperience.detailedInfo?.highlights && (
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-3xl">⭐</span>
                      Experiență Premium
                    </h4>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6">
                      <ul className="space-y-3">
                        {selectedExperience.detailedInfo.highlights.map((highlight: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-gray-800">
                            <span className="text-xl flex-shrink-0">✨</span>
                            <span className="leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Route Map */}
                {selectedExperience.routeMap && (
                  <div className="mb-8">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary-600" />
                      Harta Traseului
                    </h4>
                    <div className="bg-white border-2 border-primary-200 rounded-2xl overflow-hidden shadow-lg">
                      <img 
                        src={selectedExperience.routeMap} 
                        alt={`Harta traseului ${selectedExperience.title}`}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-3 text-center italic">
                      🗺️ Traseul complet cu punctele de interes marcate
                    </p>
                  </div>
                )}

                {/* Pachete */}
                {selectedExperience.packages && (
                  <div className="space-y-4">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-6 h-6 text-primary-600" />
                      Pachete Disponibile
                    </h4>
                    {selectedExperience.packages.map((pkg: any, index: number) => (
                      <div
                        key={index}
                        className={`border-2 rounded-2xl p-6 transition-all hover:shadow-lg ${
                          pkg.recommended
                            ? 'border-green-500 bg-green-50'
                            : pkg.experienceRequired
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 bg-white hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="text-xl font-bold text-gray-900">{pkg.name}</h5>
                          {pkg.recommended && (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              ⭐ Recomandat
                            </span>
                          )}
                          {pkg.experienceRequired && (
                            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              ⚠️ Necesită Experiență
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed text-justify">{pkg.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {pkg.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-primary-600" />
                              <span className="text-gray-600">{pkg.duration}</span>
                            </div>
                          )}
                          {pkg.distance && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-primary-600" />
                              <span className="text-gray-600">{pkg.distance}</span>
                            </div>
                          )}
                          {pkg.difficulty && (
                            <div className="flex items-center gap-2 text-sm">
                              <Shield className="w-4 h-4 text-primary-600" />
                              <span className="text-gray-600">{pkg.difficulty}</span>
                            </div>
                          )}
                          {pkg.day1 && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold text-primary-600">Ziua 1:</span>
                              <span className="text-gray-600">{pkg.day1}</span>
                            </div>
                          )}
                          {pkg.day2 && (
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-semibold text-primary-600">Ziua 2:</span>
                              <span className="text-gray-600">{pkg.day2}</span>
                            </div>
                          )}
                          {pkg.route && (
                            <div className="flex items-center gap-2 text-sm col-span-2">
                              <MapPin className="w-4 h-4 text-primary-600" />
                              <span className="text-gray-600">{pkg.route}</span>
                            </div>
                          )}
                          {pkg.camping && (
                            <div className="flex items-center gap-2 text-sm col-span-2">
                              <Tent className="w-4 h-4 text-primary-600" />
                              <span className="text-gray-600">{pkg.camping}</span>
                            </div>
                          )}
                          {pkg.protectedAreas && (
                            <div className="flex items-center gap-2 text-sm col-span-2">
                              <Shield className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600">{pkg.protectedAreas}</span>
                            </div>
                          )}
                          {pkg.wildlife && (
                            <div className="flex items-center gap-2 text-sm col-span-2">
                              <span className="text-gray-600">🦅 {pkg.wildlife}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Rental Info */}
                {selectedExperience.rentalInfo && (
                  <div className="mt-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border-2 border-blue-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Info className="w-6 h-6 text-blue-600" />
                      Informații Închiriere
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Capacitate Maximă</p>
                          <p className="text-gray-600">{selectedExperience.rentalInfo.maxCapacity}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Waves className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Caiace</p>
                          <p className="text-gray-600">{selectedExperience.rentalInfo.kayaks}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Tent className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Echipament Campare</p>
                          <p className="text-gray-600">{selectedExperience.rentalInfo.camping}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-semibold text-gray-900">Transport</p>
                          <p className="text-gray-600">{selectedExperience.rentalInfo.transport}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mt-6 bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Ce Include</h4>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {selectedExperience.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <ChevronRight className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/contact"
                    className="flex-1 bg-primary-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-700 transition-all hover:scale-105 text-center flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    Solicită Ofertă
                  </Link>
                  <a
                    href="tel:+40755503679"
                    className="flex-1 bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-all hover:scale-105 text-center flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Sună Acum
                  </a>
                </div>

                {/* Detailed Info & Notes */}
                {selectedExperience.detailedInfo && (
                  <div className="mt-6 space-y-4">
                    {selectedExperience.detailedInfo.included && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                          <strong className="text-green-700">✅ Include:</strong> {selectedExperience.detailedInfo.included}
                        </p>
                      </div>
                    )}
                    
                    {selectedExperience.detailedInfo.notes && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">📌 Informații Importante:</p>
                        <ul className="space-y-1">
                          {selectedExperience.detailedInfo.notes.map((note: string, idx: number) => (
                            <li key={idx} className="text-sm text-gray-700">{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedExperience.detailedInfo.contact && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">📞 Contact:</p>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p><strong>Telefon:</strong> <a href={`tel:+40${selectedExperience.detailedInfo.contact.phone.replace(/\s/g, '')}`} className="text-blue-600 hover:underline">{selectedExperience.detailedInfo.contact.phone}</a></p>
                          <p><strong>Email:</strong> <a href={`mailto:${selectedExperience.detailedInfo.contact.email}`} className="text-blue-600 hover:underline">{selectedExperience.detailedInfo.contact.email}</a></p>
                          <p><strong>Website:</strong> <a href={`https://${selectedExperience.detailedInfo.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedExperience.detailedInfo.contact.website}</a></p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {!selectedExperience.detailedInfo && (
                  <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700">
                      <strong>📌 Notă:</strong> Prețurile pot suferi ușoare modificări în funcție de costul transportului. 
                      Evenimentul poate fi anulat sau amânat în funcție de condițiile meteo.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 text-white shadow-2xl"
        >
          <h3 className="text-3xl font-bold mb-4">Alătură-te Aventurii și Susține Mediul!</h3>
          <p className="text-xl mb-4 text-primary-100">
            Participă la turele noastre cu caiacul sau la taberele de vară și contribuie la protejarea naturii.
          </p>
          <p className="text-lg mb-8 text-primary-50 max-w-2xl mx-auto">
            Fiecare experiență pe care o oferi susține proiectele noastre de conservare și educație ecologică.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg"
            >
              <Mail className="w-5 h-5" />
              Solicită Ofertă
            </Link>
            <a 
              href="tel:+40755503679"
              className="flex items-center justify-center gap-2 bg-primary-800 text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-900 transition-all hover:scale-105 border-2 border-white/30"
            >
              <Phone className="w-5 h-5" />
              Sună Acum
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Experiences
