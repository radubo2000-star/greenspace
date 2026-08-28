import InitiativePage from '../components/InitiativePage'
import type { InitiativeContent } from '../components/InitiativePage'

const content: InitiativeContent = {
  slug: 'educatie-si-dezvoltare',
  title: 'Educație & Dezvoltare',
  navName: '🎓 Educație & Dezvoltare',
  hero: {
    image: '/images/projects/scoala-vara.jpg',
    badge: '🎓 Educație & Dezvoltare',
    heading: 'Școala de vară, tabere și educație non-formală',
    lead: 'Programe educaționale pentru tineri: Școala de vară, tabere, workshopuri și acțiuni educaționale în școli, prin educație non-formală.',
    tags: ['🏕️ Școala de Vară', '🏕️ Tabere', '🎨 Workshopuri', '🏫 Acțiuni în școli'],
  },
  intro:
    'Credem că prin educație și solidaritate putem genera schimbări reale și durabile. Ne propunem să reducem deficitul educațional informal și non-formal al tinerilor din comunitate, implicându-i activ în diverse acțiuni, proiecte și programe de mediu. Organizăm Școala de Vară A.G.S., tabere educaționale, workshopuri și activități în școlile partenere, oferind copiilor și tinerilor oportunități de învățare practică și dezvoltare personală.',
  activities: [
    {
      title: 'Școala de Vară A.G.S.',
      description: 'În vacanța de vară, copiii din comunitate au oportunitatea de a participa la activități educative alături de voluntarii asociației. Reprezintă totodată una dintre activitățile noastre de autofinanțare, prin care susținem dezvoltarea și continuitatea proiectelor noastre.',
      icon: '☀️',
    },
    {
      title: 'Tabere educaționale',
      description: 'Organizăm tabere pentru elevi în natură, combinând învățarea cu aventura: activități outdoor, foc de tabără, ateliere și educație ecologică în peisaje spectaculoase.',
      icon: '🏕️',
    },
    {
      title: 'Workshopuri educative',
      description: 'Ateliere interactive pe teme ecologice și nu numai: creație din materiale reutilizate, educație ecologică, orientare, noduri, supraviețuire și alte teme educative.',
      icon: '🎨',
    },
    {
      title: 'Acțiuni în școli',
      description: 'În cadrul unităților școlare partenere din comunitate desfășurăm activități pe teme ecologice: ateliere din materiale reutilizate, ecologizări și workshopuri pe diverse teme educative.',
      icon: '🏫',
    },
    {
      title: 'Educație non-formală',
      description: 'Folosim metode moderne de educație non-formală pentru a transforma învățarea într-o experiență atractivă și eficientă pentru copii și tineri.',
      icon: '🧠',
    },
    {
      title: 'Formare și dezvoltare personală',
      description: 'Oferim cadrelor didactice și tinerilor oportunități de dezvoltare personală și profesională prin cursuri, training-uri și proiecte educaționale.',
      icon: '📚',
    },
  ],
  experiences: [
    {
      title: 'Școala de Vară A.G.S.',
      description: 'Program educativ intensiv în vacanța de vară, cu ateliere educative, activități în aer liber și workshopuri creative, coordonate de voluntarii asociației.',
      image: '/images/projects/scoaladevara.jpg',
      location: 'Oltenița și comunitățile partenere',
      duration: 'Vacanța de vară',
      price: 'Preț la cerere',
      features: ['🎓 Ateliere educative', '🌳 Activități în aer liber', '🎨 Workshopuri creative'],
    },
    {
      title: 'Tabere pentru elevi',
      description: 'Tabere educaționale în natură, unde copiii învață lucruri noi despre mediu, fac prietenii și trăiesc aventuri memorabile, sub supravegherea voluntarilor asociației.',
      image: '/images/projects/tabere.jpg',
      location: 'Diverse locații din România',
      duration: 'Weekend sau vacanță',
      price: 'Preț la cerere',
      features: ['🏕️ Activități outdoor', '🔥 Foc de tabără', '🤝 Socializare și prietenie'],
    },
    {
      title: 'Activități în școli',
      description: 'Workshopuri ecologice și ateliere din materiale reutilizate desfășurate în unitățile școlare partenere, pentru educarea copiilor în spiritul protejării mediului.',
      image: '/images/projects/scoli.jpg',
      location: 'Școli partenere din comunitate',
      duration: 'Pe parcursul anului școlar',
      price: 'Participare gratuită',
      features: ['🏫 Ateliere despre mediu', '♻️ Materiale reutilizate', '🌱 Educație ecologică'],
    },
  ],
  ctaTitle: 'Vrei să sprijini educația tinerilor?',
  ctaText:
    'Implică-te ca voluntar sau partener în programele noastre educaționale și contribuie la dezvoltarea armonioasă a tinerei generații.',
}

const EduatieDezvoltarePage = () => <InitiativePage content={content} />

export default EduatieDezvoltarePage
