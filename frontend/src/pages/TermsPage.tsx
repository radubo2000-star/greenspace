import { motion } from 'framer-motion'
import { FileText, Calendar, Shield, AlertCircle, Scale, Mail } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: '1. Acceptarea Termenilor',
      content: [
        'Prin accesarea și utilizarea acestui site web, acceptați să fiți legat de acești termeni și condiții de utilizare, de toate legile și reglementările aplicabile și sunteți de acord că sunteți responsabil pentru respectarea oricăror legi locale aplicabile.',
        'Dacă nu sunteți de acord cu oricare dintre acești termeni, vi se interzice utilizarea sau accesarea acestui site.',
      ],
    },
    {
      icon: Shield,
      title: '2. Licență de Utilizare',
      content: [
        'Este acordată permisiunea de a descărca temporar o copie a materialelor (informații sau software) de pe site-ul Asociației GreenSpace doar pentru vizualizare tranzitorie personală, necomercială.',
        'Aceasta este acordarea unei licențe, nu un transfer de titlu, și sub această licență nu puteți:',
      ],
      list: [
        'Modifica sau copia materialele',
        'Utiliza materialele în orice scop comercial sau pentru orice afișare publică',
        'Încerca să decompilați sau să faceți inginerie inversă a oricărui software conținut pe site',
        'Elimina orice drepturi de autor sau alte notații de proprietate din materiale',
        'Transfera materialele către o altă persoană sau să "oglindești" materialele pe orice alt server',
      ],
    },
    {
      icon: AlertCircle,
      title: '3. Disclaimer',
      content: [
        'Materialele de pe site-ul Asociației GreenSpace sunt furnizate "ca atare". Asociația GreenSpace nu oferă garanții, exprese sau implicite, și prin prezenta declină și neagă toate celelalte garanții, inclusiv, fără limitare, garanțiile implicite sau condițiile de vandabilitate, potrivire pentru un anumit scop sau neîncălcarea proprietății intelectuale sau a altei încălcări a drepturilor.',
        'În plus, Asociația GreenSpace nu garantează și nu face nicio declarație cu privire la acuratețea, rezultatele probabile sau fiabilitatea utilizării materialelor de pe site-ul său web sau în alt mod legate de astfel de materiale sau pe orice site-uri legate de acest site.',
      ],
    },
    {
      icon: Scale,
      title: '4. Limitări',
      content: [
        'În niciun caz Asociația GreenSpace sau furnizorii săi nu vor fi răspunzători pentru niciun prejudiciu (inclusiv, fără limitare, daune pentru pierderea de date sau profit sau din cauza întreruperii afacerii) care decurg din utilizarea sau incapacitatea de a utiliza materialele de pe site-ul Asociației GreenSpace, chiar dacă Asociația GreenSpace sau un reprezentant autorizat al Asociației GreenSpace a fost notificat oral sau în scris de posibilitatea unor astfel de daune.',
        'Deoarece unele jurisdicții nu permit limitări ale garanțiilor implicite sau limitări ale răspunderii pentru daune consecutive sau incidentale, aceste limitări pot să nu se aplice în cazul dumneavoastră.',
      ],
    },
    {
      icon: FileText,
      title: '5. Acuratețea Materialelor',
      content: [
        'Materialele care apar pe site-ul Asociației GreenSpace ar putea include erori tehnice, tipografice sau fotografice. Asociația GreenSpace nu garantează că oricare dintre materialele de pe site-ul său sunt exacte, complete sau actuale.',
        'Asociația GreenSpace poate face modificări materialelor conținute pe site-ul său în orice moment, fără notificare prealabilă. Cu toate acestea, Asociația GreenSpace nu se angajează să actualizeze materialele.',
      ],
    },
    {
      icon: Shield,
      title: '6. Link-uri',
      content: [
        'Asociația GreenSpace nu a revizuit toate site-urile legate de site-ul său web și nu este responsabilă pentru conținutul niciunui astfel de site legat. Includerea oricărui link nu implică aprobarea de către Asociația GreenSpace a site-ului. Utilizarea oricărui astfel de site web legat este pe propriul risc al utilizatorului.',
      ],
    },
    {
      icon: FileText,
      title: '7. Modificări',
      content: [
        'Asociația GreenSpace poate revizui acești termeni de utilizare pentru site-ul său web în orice moment, fără notificare prealabilă. Prin utilizarea acestui site web, acceptați să fiți legat de versiunea curentă a acestor termeni de utilizare.',
      ],
    },
    {
      icon: Scale,
      title: '8. Legea Aplicabilă',
      content: [
        'Acești termeni și condiții sunt guvernați și interpretați în conformitate cu legile din România și vă supuneți irevocabil jurisdicției exclusive a instanțelor din acea țară sau locație.',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-600 via-primary-700 to-green-600 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-block">
                <FileText className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Termeni și Condiții
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Vă rugăm să citiți cu atenție acești termeni și condiții înainte de a utiliza serviciile noastre
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 text-white/80"
            >
              <Calendar className="w-5 h-5" />
              <span>Ultima actualizare: Ianuarie 2024</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-12"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Informații Importante
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Acești termeni și condiții stabilesc regulile și reglementările pentru utilizarea site-ului web al Asociației GreenSpace, localizat la asociatiagreenspace.ro. Prin accesarea acestui site web, presupunem că acceptați acești termeni și condiții. Nu continuați să utilizați site-ul dacă nu sunteți de acord să acceptați toți termenii și condițiile prezentate pe această pagină.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-8">
              {sections.map((section, index) => {
                const Icon = section.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="bg-primary-100 p-3 rounded-xl">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 flex-1">
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex}>{paragraph}</p>
                      ))}

                      {section.list && (
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                          {section.list.map((item, lIndex) => (
                            <li key={lIndex} className="text-gray-700">
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 bg-gradient-to-br from-primary-50 to-green-50 rounded-2xl p-8 border-2 border-primary-100"
            >
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-md">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Aveți întrebări?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Dacă aveți întrebări sau nelămuriri cu privire la acești termeni și condiții, vă rugăm să ne contactați:
                  </p>
                  <a
                    href="mailto:contact@asociatiagreenspace.ro"
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    contact@asociatiagreenspace.ro
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default TermsPage
