import InitiativePage from '../components/InitiativePage'
import type { InitiativeContent } from '../components/InitiativePage'

const content: InitiativeContent = {
  slug: 'mediu-si-conservare',
  title: 'Mediu & Conservare',
  navName: '🌱 Mediu & Conservare',
  hero: {
    image: '/images/experiences/impadurire.webp',
    badge: '🌱 Mediu & Conservare',
    heading: 'Plantări, ecologizări și protejarea naturii',
    lead: 'Acțiuni concrete de protejare și conservare a mediului înconjurător, în parteneriat cu comunitatea și instituțiile locale.',
    tags: ['🌲 Plantări', '♻️ Ecologizări', '💧 Studii ecologice', '🛡️ Conservare'],
  },
  intro:
    'Protejarea și conservarea mediului natural reprezintă una dintre misiunile de bază ale asociației noastre. Prin acțiuni concrete de igienizare, plantare și studii ecologice intervenim asupra ecosistemelor afectate și contribuim la refacerea habitatelor naturale. Lucrăm în parteneriat cu primăriile, direcțiile și ocoalele silvice, precum și cu parteneri din domeniul privat, pentru a crea un impact real și durabil asupra naturii.',
  activities: [
    {
      title: 'Ecologizări',
      description: 'Intervenim asupra mediului natural prin igienizarea unor zone sălbatice afectate de poluare cu deșeuri provenite din activități de agrement desfășurate într-un mod iresponsabil: malurile râului Argeș, zonele de vărsare în Dunăre și alte zone afectate de deșeuri.',
      icon: '♻️',
    },
    {
      title: 'Plantări / Împăduriri',
      description: 'Promovăm și sprijinim acțiunile de împădurire și crearea de perdele forestiere în parteneriat cu primăriile, direcțiile și ocoalele silvice, contribuind la regenerarea zonelor verzi și refacerea ecosistemelor naturale.',
      icon: '🌲',
    },
    {
      title: 'Studii Ecologice',
      description: 'Ne-am propus dotarea laboratoarelor școlare (chimie și biologie) cu echipamente care permit inițierea unor studii asupra solului, apelor și izvoarelor, precum și promovarea rezultatelor în spațiul public.',
      icon: '🔬',
    },
    {
      title: 'Regenerarea zonelor verzi',
      description: 'Refacem ecosistemele naturale prin acțiuni de plantare și regenerare a zonelor verzi, creând perdele forestiere în comunitate și protejând ariile naturale.',
      icon: '🌿',
    },
    {
      title: 'Monitorizarea apelor și solului',
      description: 'Analizăm și monitorizăm calitatea solului și apelor, folosind echipamentele din laboratoarele școlare pentru studii relevante în protecția mediului.',
      icon: '💧',
    },
    {
      title: 'Campanii de conștientizare',
      description: 'Organizăm campanii publice pentru conștientizarea importanței protejării mediului și promovarea unui comportament responsabil față de natură.',
      icon: '📢',
    },
  ],
  experiences: [
    {
      title: 'Reîmpădurire & Plantare',
      description: 'Campanii de plantare în parteneriat cu Ocolul Silvic Mitreni, prin care contribuim la crearea de perdele forestiere în comunitate și la refacerea ecosistemelor naturale.',
      image: '/images/experiences/impadurire.webp',
      location: 'Comunitatea Oltenița & împrejurimi',
      duration: 'Acțiuni sezoniere',
      price: 'Participare gratuită',
      features: ['🌲 Campanii de plantare', '🏞️ Perdele forestiere', '🤝 Parteneriate cu Ocolul Silvic'],
    },
    {
      title: 'Ecologizarea malurilor Argeșului',
      description:
        'Curățăm malurile râului Argeș de deșeuri, pentru a proteja biodiversitatea locală și a reda publicului peisajele naturale spectaculoase ale zonei.',
      image: '/images/projects/ecologizare.jpg',
      location: 'Pe malul Argeșului, Oltenița',
      duration: 'Acțiuni periodice',
      price: 'Participare gratuită',
      features: ['♻️ Igienizare zone sălbatice', '💧 Ape mai curate', '🦆 Protejarea biodiversității'],
    },
    {
      title: 'Ecologizare la vărsarea în Dunăre',
      description:
        'Ecologizarea zonelor de la vărsarea Argeșului în Dunăre, contribuind la conservarea ariilor naturale protejate și a habitatelor din zonă.',
      image: '/images/projects/ecologizari-apa.jpg',
      location: 'Zona de confluență cu Dunărea',
      duration: 'Acțiuni periodice',
      price: 'Participare gratuită',
      features: ['🌿 Arii naturale protejate', '🦩 Protejarea faunei', '🤝 Voluntari implicați'],
    },
  ],
  ctaTitle: 'Vrei să ajuți la protejarea mediului?',
  ctaText:
    'Alătură-te acțiunilor noastre de plantare și ecologizare și contribuie la conservarea naturii pentru generațiile viitoare.',
}

const MediuConservarePage = () => <InitiativePage content={content} />

export default MediuConservarePage
