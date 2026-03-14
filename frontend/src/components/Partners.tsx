import { motion } from 'framer-motion';
import { Handshake, Trophy, Star, Award, CheckCircle, Mail, Phone, Globe } from 'lucide-react';
import { Button } from './ui/button';

const Partners = () => {
  const sponsorshipPackages = [
    {
      name: 'Platinum',
      price: '10.000+ EUR/an',
      color: 'from-gray-400 to-gray-600',
      icon: Trophy,
      benefits: [
        'Logo pe toate materialele promoționale',
        'Naming rights pentru evenimente majore',
        'Prezență la toate evenimentele AGS',
        'Articole dedicate și PR',
        'Mențiuni în toate comunicările',
        'Raportare lunară impact',
        'Acces exclusiv la evenimente VIP',
      ],
    },
    {
      name: 'Gold',
      price: '5.000-10.000 EUR/an',
      color: 'from-yellow-400 to-yellow-600',
      icon: Star,
      benefits: [
        'Logo pe materiale principale',
        'Prezență la evenimente majore',
        'Mențiuni în comunicări oficiale',
        'Articole și PR',
        'Raportare trimestrială',
        'Invitații la evenimente speciale',
      ],
    },
    {
      name: 'Silver',
      price: '2.000-5.000 EUR/an',
      color: 'from-gray-300 to-gray-500',
      icon: Award,
      benefits: [
        'Logo pe materiale selectate',
        'Prezență la evenimente selectate',
        'Mențiuni în newsletter',
        'Raportare semestrială',
        'Certificat de parteneriat',
      ],
    },
    {
      name: 'Bronze',
      price: '500-2.000 EUR/an',
      color: 'from-orange-400 to-orange-600',
      icon: Handshake,
      benefits: [
        'Logo pe website',
        'Mențiuni în social media',
        'Certificat de parteneriat',
        'Raportare anuală',
      ],
    },
  ];

  const partnershipTypes = [
    {
      title: 'Sponsorizare Financiară',
      description: 'Susține financiar proiectele și activitățile noastre',
      icon: Trophy,
      color: 'text-yellow-600',
    },
    {
      title: 'Parteneriat Strategic',
      description: 'Colaborare pe termen lung pentru proiecte comune',
      icon: Handshake,
      color: 'text-blue-600',
    },
    {
      title: 'Donații în Natură',
      description: 'Echipamente, servicii sau produse pentru evenimente',
      icon: Award,
      color: 'text-green-600',
    },
    {
      title: 'Voluntariat Corporate',
      description: 'Implicarea angajaților în activitățile noastre',
      icon: Star,
      color: 'text-purple-600',
    },
  ];

  const benefits = [
    'Vizibilitate crescută în comunitate',
    'Asociere cu cauze sociale și ecologice',
    'Oportunități de team building',
    'Acces la evenimente exclusive',
    'Networking cu alți parteneri',
    'Raportare transparentă a impactului',
    'Certificat de parteneriat',
    'Mențiuni în media și PR',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/experiences/pe%20dunare.jpg')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Handshake className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Devino <span className="text-primary">Partener</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Alătură-te misiunii noastre de a promova turismul activ și protecția mediului pe Dunărea de Jos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Impactul Nostru în 2024</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Rezultate concrete ale activităților noastre
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-xl border text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Participanți la evenimente</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-xl border text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Evenimente organizate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card p-6 rounded-xl border text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">200km</div>
              <div className="text-sm text-muted-foreground">Dunăre explorată</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-card p-6 rounded-xl border text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-sm text-muted-foreground">Acțiuni de ecologizare</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">De ce să devii partener?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Parteneriatul cu AGS îți oferă oportunitatea de a face diferența și de a-ți crește vizibilitatea în comunitate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 bg-card p-4 rounded-lg border"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Tipuri de Parteneriat</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Alege forma de colaborare care se potrivește cel mai bine organizației tale
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {partnershipTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-xl border hover:shadow-lg transition-shadow"
              >
                <type.icon className={`w-12 h-12 ${type.color} mb-4`} />
                <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Pachete de Sponsorizare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferim pachete flexibile adaptate nevoilor și bugetului tău
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {sponsorshipPackages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className={`bg-gradient-to-r ${pkg.color} p-6 text-white`}>
                  <pkg.icon className="w-12 h-12 mb-3" />
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-sm opacity-90">{pkg.price}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {pkg.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Cum Funcționează Parteneriatul?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Procesul simplu de la primul contact până la colaborarea activă
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-card p-6 rounded-xl border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Contact Inițial</h3>
                <p className="text-sm text-muted-foreground">
                  Ne contactezi telefonic sau prin email pentru a discuta despre oportunități
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="bg-card p-6 rounded-xl border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Întâlnire & Prezentare</h3>
                <p className="text-sm text-muted-foreground">
                  Organizăm o întâlnire pentru a prezenta proiectele și a discuta nevoile tale
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="bg-card p-6 rounded-xl border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Acord de Parteneriat</h3>
                <p className="text-sm text-muted-foreground">
                  Semnăm un acord care definește clar beneficiile și responsabilitățile
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="bg-card p-6 rounded-xl border text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <h3 className="font-semibold mb-2">Colaborare Activă</h3>
                <p className="text-sm text-muted-foreground">
                  Începem colaborarea cu raportare regulată și comunicare constantă
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Partenerii Noștri</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Mulțumim partenerilor care ne susțin în misiunea noastră
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card p-6 rounded-xl border"
            >
              <h3 className="text-xl font-semibold mb-2">FISHERMAN'S MEETING</h3>
              <p className="text-sm text-muted-foreground mb-3">Bulgaria - Dunărea de Jos</p>
              <p className="text-sm">
                Partener strategic pentru cazare și servicii în cadrul turelor premium Giurgiu - Oltenița
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card p-6 rounded-xl border"
            >
              <h3 className="text-xl font-semibold mb-2">Danube Pearl</h3>
              <p className="text-sm text-muted-foreground mb-3">Bulgaria - Dunărea de Jos</p>
              <p className="text-sm">
                Partener strategic pentru cazare și servicii în cadrul turelor premium Oltenița - Călărași
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 p-8 md:p-12 rounded-2xl border border-primary/20 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Hai să colaborăm!</h2>
            <p className="text-muted-foreground mb-8">
              Contactează-ne pentru a discuta despre oportunități de parteneriat personalizate
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-primary mb-2" />
                <a 
                  href="tel:0755503679" 
                  className="text-primary hover:underline font-medium"
                >
                  0755 503 679
                </a>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-primary mb-2" />
                <a 
                  href="mailto:contact@asociatiagreenspace.ro" 
                  className="text-primary hover:underline font-medium text-sm"
                >
                  contact@asociatiagreenspace.ro
                </a>
              </div>
              <div className="flex flex-col items-center">
                <Globe className="w-8 h-8 text-primary mb-2" />
                <a 
                  href="https://www.kayakromania.ro" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  www.kayakromania.ro
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = 'mailto:contact@asociatiagreenspace.ro?subject=Interes%20Parteneriat'}
              >
                <Mail className="w-4 h-4 mr-2" />
                Trimite Email
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'tel:0755503679'}
              >
                <Phone className="w-4 h-4 mr-2" />
                Sună Acum
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
