import InitiativePage from '../components/InitiativePage'
import type { InitiativeContent } from '../components/InitiativePage'

const content: InitiativeContent = {
  slug: 'dezvoltare-durabila-turism-regenerativ',
  title: 'Dezvoltare Durabilă & Turism Regenerativ',
  navName: '🛶 Dezvoltare Durabilă & Turism Regenerativ',
  hero: {
    image: '/images/experiences/kaiacedesus.webp',
    badge: '🛶 Dezvoltare Durabilă & Turism Regenerativ',
    heading: 'Ture cu caiacul, activități outdoor și experiențe în natură',
    lead: 'Promovăm turismul regenerativ prin curse și ture cu caiacul, activități outdoor și experiențe autentice în natură, la 45 de minute de București.',
    tags: ['🛶 Ture cu Caiacul', '🏔️ Activități outdoor', '🌍 Turism regenerativ', '🌿 Experiențe în natură'],
  },
  intro:
    'Comunitatea noastră dispune de multiple posibilități de agrement, iar noi promovăm un turism responsabil și regenerativ, care contribuie la protejarea naturii și la dezvoltarea durabilă a zonei. Organizăm curse și ture cu caiacul pe Argeș și Dunăre, drumeții montane, tabere în natură și alte activități outdoor, prin care oferim participanților experiențe autentice, iar fondurile obținute susțin proiectele noastre de conservare și educație ecologică.',
  activities: [
    {
      title: 'Ture cu Caiacul',
      description: 'Curse și ture cu caiacul pe râul Argeș și fluviul Dunărea, prin arii naturale protejate, alături de ghizi experimentați și iubitori de natură.',
      icon: '🛶',
    },
    {
      title: 'Tabere și campare în natură',
      description: 'Ture cu caiacul de două zile cu campare pe malurile sălbatice ale Dunării, tabere pentru elevi și experiențe complete de conectare cu natura.',
      icon: '⛺',
    },
    {
      title: 'Drumeții montane',
      description: 'Drumeții de o zi sau cu campare prin munții României, trasee adaptate pentru toate nivelurile, cu ghizi montani experimentați.',
      icon: '🥾',
    },
    {
      title: 'Promovarea turismului regenerativ',
      description: 'Promovăm un model de turism care contribuie activ la refacerea ecosistemelor și sprijină comunitatea locală, fiecare experiență susținând proiectele noastre de conservare.',
      icon: '🌍',
    },
    {
      title: 'Ecoturism și educație',
      description: 'Experiențele noastre includ educație despre flora și fauna locală, despre ariile protejate și despre un comportament responsabil în natură.',
      icon: '🌿',
    },
    {
      title: 'Închiriere echipamente',
      description: 'Punem la dispoziție contra cost echipamente complete pentru grupuri mari: caiace, echipamente de campare, van 4x4 și consultanță pentru organizarea de evenimente.',
      icon: '🎒',
    },
  ],
  experiences: [
    {
      title: 'Ture cu Caiacul de o Zi',
      description:
        'Experiență de agrement cu caiacul pe râul Argeș și fluviul Dunărea, prin arii naturale protejate, cu ghizi experimentați și echipament complet inclus.',
      image: '/images/experiences/10caiacepe arges.jpg',
      location: 'Oltenița - 45 min de București',
      duration: 'O zi completă',
      price: 'Preț variabil în funcție de pachet',
      features: ['🚣 Echipament complet inclus', '🌿 Arii naturale protejate', '🦅 Observarea faunei'],
    },
    {
      title: 'Ture cu Caiacul de 2 Zile (Campare)',
      description:
        'Campare pe malurile sălbatice ale Dunării, cu foc de tabără și workshop-uri de orientare, noduri și supraviețuire. O experiență unică în sălbăticie.',
      image: '/images/experiences/2dunare.jpg',
      location: 'Fluviul Dunărea - plecare din Oltenița',
      duration: '2 zile cu campare',
      price: 'Preț variabil în funcție de pachet',
      features: ['⛺ Campare pe malurile Dunării', '🔥 Foc de tabără', '📚 Workshop-uri în natură'],
    },
    {
      title: 'Drumeții montane',
      description:
        'Explorează frumusețea munților României alături de ghizi experimentați, prin trasee adaptate pentru toate nivelurile și peisaje spectaculoase.',
      image: '/images/experiences/hiking-day.jpg',
      location: 'Diverse trasee montane',
      duration: 'O zi sau weekend',
      price: 'Preț la cerere',
      features: ['🥾 Trasee pentru toate nivelurile', '🏔️ Peisaje spectaculoase', '🌿 Educație despre natură'],
    },
    {
      title: 'Kayak Trail: Giurgiu - Oltenița',
      description:
        'Aventură de două zile cu caiacul pe Dunăre, prin arii sălbatice Natura 2000, printre ostroave izolate și zeci de specii de păsări protejate.',
      image: '/images/experiences/giurgiu-oltenita-kaiak.jpeg',
      location: 'Giurgiu → Oltenița (Dunărea de Jos)',
      duration: '2 zile / 1 noapte',
      price: 'Preț la cerere',
      features: ['🌿 Arii Natura 2000', '🏨 Cazare confortabilă', '👨‍🏫 Ghidaj profesionist'],
    },
  ],
  ctaTitle: 'Vrei să trăiești o experiență în natură?',
  ctaText:
    'Participă la turele noastre cu caiacul sau la drumețiile montane și contribuie direct la protejarea naturii prin turism regenerativ.',
}

const DezvoltareDurabilaTurismRegenerativPage = () => <InitiativePage content={content} />

export default DezvoltareDurabilaTurismRegenerativPage
