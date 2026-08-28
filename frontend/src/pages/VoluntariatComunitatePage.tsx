import InitiativePage from '../components/InitiativePage'
import type { InitiativeContent } from '../components/InitiativePage'

const content: InitiativeContent = {
  slug: 'voluntariat-si-comunitate',
  title: 'Voluntariat & Comunitate',
  navName: '🤝 Voluntariat & Comunitate',
  hero: {
    image: '/images/projects/ags-help.jpg',
    badge: '🤝 Voluntariat & Comunitate',
    heading: 'Programe de voluntariat și implicare comunitară',
    lead: 'Voluntariat, implicare comunitară și inițiative pentru tineri. Voluntarii sunt cea mai importantă resursă a asociației noastre.',
    tags: ['🤝 Voluntariat', '🏘️ Comunitate', '🧑‍🤝‍🧑 Inițiative pentru tineri'],
  },
  intro:
    'Voluntarii reprezintă cea mai importantă resursă a asociației noastre. Aceștia provin din rândul elevilor din comunitate și sunt implicați activ în toate acțiunile pe care le desfășurăm. Ne-am propus să implicăm peste 100 de elevi în proiectele noastre, dezvoltând programe de voluntariat, implicare comunitară și inițiative dedicate tinerilor.',
  activities: [
    {
      title: 'Program de Voluntariat',
      description: 'Un program structurat prin care elevii din comunitate se implică activ în toate acțiunile asociației, dezvoltându-și abilități, responsabilitate și spirit de echipă.',
      icon: '🤝',
    },
    {
      title: 'Inițiative pentru tineri',
      description: 'Am pornit inițiative de a implica tinerii în drumeții montane și ture cu caiacul, organizând tabere de inițiere și proiecte de ecoturism care le oferă învățare practică.',
      icon: '🧑‍🤝‍🧑',
    },
    {
      title: 'Implicare comunitară',
      description: 'Organizăm acțiuni care contribuie la coeziunea comunității și la crearea unei rețele funcționale între instituțiile publice, partenerii privați și comunitate.',
      icon: '🏡',
    },
  ],
  experiences: [
    {
      title: 'Eco Ambasadori',
      description: 'Un program dedicat tinerilor din comunitate, prin care îi inițiem în drumeții montane și ture cu caiacul și îi implicăm direct în proiecte de ecoturism, oferindu-le oportunități de învățare practică.',
      image: '/images/experiences/exp1.jpg',
      location: 'Comunitatea Oltenița',
      duration: 'Pe parcursul anului',
      price: 'Participare gratuită',
      features: ['🥾 Drumeții montane', '🚣 Tabere inițiere caiac', '🌿 Proiecte ecoturism'],
    },
  ],
  ctaTitle: 'Vrei să devii voluntar?',
  ctaText:
    'Alătură-te echipei noastre de voluntari și contribuie la construirea unei comunități mai unite, responsabile și implicate.',
}

const VoluntariatComunitatePage = () => <InitiativePage content={content} />

export default VoluntariatComunitatePage
