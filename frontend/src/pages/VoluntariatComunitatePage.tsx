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
    tags: ['🤝 Voluntariat', '🏘️ Comunitate', '🧑‍🤝‍🧑 Inițiative pentru tineri', '❤️ Umanitar'],
  },
  intro:
    'Voluntarii reprezintă cea mai importantă resursă a asociației noastre. Aceștia provin din rândul elevilor din comunitate și sunt implicați activ în toate acțiunile pe care le desfășurăm. Ne-am propus să implicăm peste 100 de elevi în proiectele noastre, dezvoltând programe de voluntariat, implicare comunitară și inițiative dedicate tinerilor, inclusiv prin proiecte de tip Erasmus+ și amenajarea unui HUB comunitar pentru tineret.',
  activities: [
    {
      title: 'Program de Voluntariat',
      description: 'Un program structurat prin care elevii din comunitate se implică activ în toate acțiunile asociației, dezvoltându-și abilități, responsabilitate și spirit de echipă.',
      icon: '🤝',
    },
    {
      title: 'HUB Comunitar Tineret',
      description: 'Am urmărit identificarea și amenajarea unui spațiu dedicat tinerilor care să funcționeze ca incubator de activități, oferind oportunități de dezvoltare personală și profesională.',
      icon: '🏘️',
    },
    {
      title: 'Proiecte Erasmus+',
      description: 'Inițiem și implementăm proiecte de tip Erasmus+ pentru tinerii din comunitate, organizând mobilități internaționale, training-uri și schimburi de experiență.',
      icon: '🌍',
    },
    {
      title: 'Inițiative pentru tineri',
      description: 'Am pornit inițiative de a implica tinerii în drumeții montane și ture cu caiacul, organizând tabere de inițiere și proiecte de ecoturism care le oferă învățare practică.',
      icon: '🧑‍🤝‍🧑',
    },
    {
      title: 'Acțiuni umanitare',
      description: 'În pragul sărbătorilor și atunci când suntem sesizați, ne mobilizăm pentru a acorda sprijin de natură materială familiilor nevoiașe din comunitate, prin campanii de tip fundraising.',
      icon: '❤️',
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
    {
      title: 'HUB Comunitar Tineret',
      description: 'Un spațiu dedicat tinerilor care funcționează ca incubator de activități, cu inițierea și implementarea de proiecte Erasmus+ și alte oportunități de dezvoltare.',
      image: '/images/projects/ags-help.webp',
      location: 'Oltenița',
      duration: 'Permanent',
      price: 'Acces gratuit pentru tineri',
      features: ['🏘️ Spațiu pentru activități', '🌍 Proiecte Erasmus+', '🏫 Training-uri pentru tineri'],
    },
    {
      title: 'Campanii umanitare',
      description: 'Campanii de tip fundraising pentru a acorda sprijin material familiilor nevoiașe din comunitate, mai ales în pragul sărbătorilor.',
      image: '/images/projects/campare.jpg',
      location: 'Comunitatea Oltenița',
      duration: 'În perioade speciale',
      price: 'Participare gratuită',
      features: ['❤️ Sprijin pentru familii', '🎁 Campanii de sărbători', '🤝 Intervenții urgente'],
    },
  ],
  ctaTitle: 'Vrei să devii voluntar?',
  ctaText:
    'Alătură-te echipei noastre de voluntari și contribuie la construirea unei comunități mai unite, responsabile și implicate.',
}

const VoluntariatComunitatePage = () => <InitiativePage content={content} />

export default VoluntariatComunitatePage
