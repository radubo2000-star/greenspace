import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  Handshake,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDocsPage = () => {
  const [activeTab, setActiveTab] = useState<'planificare' | 'responsabilitati' | 'parteneri'>('planificare');

  const tabs = [
    { id: 'planificare' as const, label: 'Planificare 2026', icon: Calendar },
    { id: 'responsabilitati' as const, label: 'Responsabilități', icon: Users },
    { id: 'parteneri' as const, label: 'Parteneri', icon: Handshake }
  ];

  // Planificare 2026 Data
  const planificare = {
    formare: [
      {
        title: 'Curs Kayak Online',
        description: 'Curs cu tehnici pe caiac',
        link: 'https://www.onlineseakayaking.com/subscriptions',
        responsabil: '-',
        status: 'Planificat',
        prioritate: 'Medie'
      },
      {
        title: 'Curs Kayak Practic',
        description: 'Sea Kayak Improvers - Sea Kayak Academy',
        responsabil: '-',
        status: 'Planificat',
        prioritate: 'Înaltă'
      },
      {
        title: 'Curs Ghid Local',
        description: 'Formare prin CNIT',
        responsabil: '-',
        status: 'Planificat',
        prioritate: 'Înaltă'
      },
      {
        title: 'Parteneriat FRCC',
        description: 'Workshop 3-4 zile în Delta/Dunăre cu sportivi/instructori FRCC',
        responsabil: '-',
        status: 'Propunere',
        prioritate: 'Înaltă'
      }
    ],
    programe: [
      {
        title: 'AGS - Junior',
        description: 'Experiențe contra cost o dată pe săptămână pentru copiii din comunitate - tip cercetași',
        responsabil: 'Mihalache',
        status: 'În dezvoltare',
        prioritate: 'Critică'
      },
      {
        title: 'Colaboratori Tabere',
        description: 'Căutare parteneri externi pentru organizare tabere și prestare servicii',
        responsabil: 'Alexandra M',
        status: 'În dezvoltare',
        prioritate: 'Înaltă'
      }
    ],
    media: [
      {
        title: 'Film Documentar Sahia',
        description: 'Film documentar despre proiectul mesei de la Sahia',
        responsabil: 'Sulyok',
        status: 'Planificat',
        prioritate: 'Medie'
      },
      {
        title: 'Instrumente Măsurare Impact',
        description: 'Mecanism pentru măsurarea impactului programelor și proiectelor',
        responsabil: 'Alexandra M',
        status: 'Planificat',
        prioritate: 'Înaltă'
      }
    ],
    echipamente: [
      {
        title: 'Vopsit Rover',
        description: 'Vopsea Raptor pentru rover',
        responsabil: '-',
        status: 'Planificat',
        prioritate: 'Medie'
      }
    ],
    parteneriate: [
      {
        title: 'Plantare Stejar Sahia',
        description: 'Achiziție și plantare stejar 3-4m în curtea sălii de sport',
        responsabil: 'Bezdadea',
        status: 'Planificat',
        prioritate: 'Medie'
      },
      {
        title: 'Networking Parteneri',
        description: 'Contact trimestrial cu partenerii pentru actualizări și colaborări',
        responsabil: 'Bianca, Ada',
        status: 'În curs',
        prioritate: 'Înaltă'
      },
      {
        title: 'Pachet Sponsori',
        description: 'Dezvoltare pachet pentru atragere sponsori',
        responsabil: '-',
        status: 'Planificat',
        prioritate: 'Critică'
      }
    ],
    resurse: [
      {
        title: 'Membri Noi',
        description: 'Căutare studenți/adulți pentru secretariat și adrese',
        responsabil: 'Adrian - G. penu',
        status: 'În curs',
        prioritate: 'Înaltă'
      }
    ],
    legal: [
      {
        title: 'Legalitate Activități Caiac',
        description: 'Studiu/consultanță legislativă pentru activitatea de caiac',
        responsabil: 'Adrian și Ghezea',
        status: 'Planificat',
        prioritate: 'Critică'
      }
    ],
    autofinantare: [
      {
        title: 'Strategie Închiriere Echipamente',
        description: 'Dezvoltare strategie de autofinanțare prin închiriere echipamente',
        responsabil: 'Adrian',
        status: 'Planificat',
        prioritate: 'Înaltă'
      }
    ]
  };

  // Responsabilități Data
  const responsabilitati = [
    {
      nume: 'Mihalache',
      rol: 'Coordonator Programe Comunitare',
      proiecte: ['AGS - Junior'],
      workload: 'Mediu'
    },
    {
      nume: 'Alexandra M',
      rol: 'Manager Proiecte & Impact',
      proiecte: ['Colaboratori Tabere', 'Instrumente Măsurare Impact'],
      workload: 'Ridicat'
    },
    {
      nume: 'Sulyok',
      rol: 'Coordonator Media',
      proiecte: ['Film Documentar Sahia'],
      workload: 'Mediu'
    },
    {
      nume: 'Bezdadea',
      rol: 'Coordonator Proiecte Ecologice',
      proiecte: ['Plantare Stejar Sahia'],
      workload: 'Scăzut'
    },
    {
      nume: 'Bianca',
      rol: 'Manager Parteneriate',
      proiecte: ['Networking Parteneri'],
      workload: 'Mediu'
    },
    {
      nume: 'Ada',
      rol: 'Coordonator Comunicare',
      proiecte: ['Networking Parteneri'],
      workload: 'Mediu'
    },
    {
      nume: 'Adrian',
      rol: 'Manager Operațiuni & Legal',
      proiecte: ['Legalitate Activități Caiac', 'Strategie Închiriere Echipamente'],
      workload: 'Ridicat'
    },
    {
      nume: 'Ghezea',
      rol: 'Consultant Legal',
      proiecte: ['Legalitate Activități Caiac'],
      workload: 'Scăzut'
    },
    {
      nume: 'G. penu',
      rol: 'Coordonator Resurse Umane',
      proiecte: ['Membri Noi'],
      workload: 'Mediu'
    }
  ];

  // Parteneri Data
  const parteneri = {
    actuali: [
      {
        nume: "FISHERMAN'S MEETING",
        tara: 'Bulgaria',
        tip: 'Cazare',
        servicii: 'Cazare pentru traseu Giurgiu-Oltenița',
        contact: '-'
      },
      {
        nume: 'Danube Pearl',
        tara: 'Bulgaria',
        tip: 'Cazare',
        servicii: 'Cazare pentru traseu Oltenița-Călărași',
        contact: '-'
      }
    ],
    potentiali: [
      {
        nume: 'FRCC (Federația Română de Caiac-Canoe)',
        tip: 'Formare',
        servicii: 'Workshop și formare membri AGS',
        status: 'În negociere'
      },
      {
        nume: 'CNIT',
        tip: 'Certificare',
        servicii: 'Curs ghid local',
        status: 'Planificat'
      },
      {
        nume: 'Sea Kayak Academy',
        tip: 'Formare',
        servicii: 'Curs practic Sea Kayak Improvers',
        status: 'Planificat'
      },
      {
        nume: 'Organizatori Tabere',
        tip: 'Colaborare',
        servicii: 'Parteneriat pentru organizare tabere',
        status: 'Căutare activă'
      }
    ],
    sponsori: [
      {
        nivel: 'Platinum',
        buget: '10.000+ EUR/an',
        beneficii: 'Logo pe toate materialele, naming rights, prezență la toate evenimentele'
      },
      {
        nivel: 'Gold',
        buget: '5.000-10.000 EUR/an',
        beneficii: 'Logo pe materiale principale, prezență la evenimente majore'
      },
      {
        nivel: 'Silver',
        buget: '2.000-5.000 EUR/an',
        beneficii: 'Logo pe materiale selectate, prezență la evenimente selectate'
      },
      {
        nivel: 'Bronze',
        buget: '500-2.000 EUR/an',
        beneficii: 'Logo pe website, mențiuni social media'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'În curs':
      case 'În dezvoltare':
        return 'bg-blue-100 text-blue-800';
      case 'Planificat':
        return 'bg-yellow-100 text-yellow-800';
      case 'Propunere':
        return 'bg-purple-100 text-purple-800';
      case 'Căutare activă':
        return 'bg-orange-100 text-orange-800';
      case 'În negociere':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioritate: string) => {
    switch (prioritate) {
      case 'Critică':
        return 'bg-red-100 text-red-800';
      case 'Înaltă':
        return 'bg-orange-100 text-orange-800';
      case 'Medie':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'Ridicat':
        return 'bg-red-100 text-red-800';
      case 'Mediu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scăzut':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Înapoi la Admin Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-600" />
                  Documentație Internă
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Planificare, responsabilități și parteneri AGS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-cyan-600 text-cyan-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Planificare 2026 */}
        {activeTab === 'planificare' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Formare și Dezvoltare */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-cyan-600" />
                Formare și Dezvoltare
              </h2>
              <div className="grid gap-4">
                {planificare.formare.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.prioritate)}`}>
                          {item.prioritate}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    {item.link && (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                      >
                        Vezi detalii →
                      </a>
                    )}
                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Responsabil: {item.responsabil}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Programe Comunitare */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-cyan-600" />
                Programe Comunitare
              </h2>
              <div className="grid gap-4">
                {planificare.programe.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.prioritate)}`}>
                          {item.prioritate}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Responsabil: {item.responsabil}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Media și Documentare */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-600" />
                Media și Documentare
              </h2>
              <div className="grid gap-4">
                {planificare.media.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.prioritate)}`}>
                          {item.prioritate}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Responsabil: {item.responsabil}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parteneriate și Colaborări */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Handshake className="w-6 h-6 text-cyan-600" />
                Parteneriate și Colaborări
              </h2>
              <div className="grid gap-4">
                {planificare.parteneriate.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.prioritate)}`}>
                          {item.prioritate}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>Responsabil: {item.responsabil}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alte Categorii */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Echipamente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Echipamente</h3>
                {planificare.echipamente.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Resurse Umane */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resurse Umane</h3>
                {planificare.resurse.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal & Autofinanțare</h3>
                {planificare.legal.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4 mb-3">
                    <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
                {planificare.autofinantare.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Responsabilități */}
        {activeTab === 'responsabilitati' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid gap-4">
              {responsabilitati.map((membru, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{membru.nume}</h3>
                      <p className="text-gray-600">{membru.rol}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getWorkloadColor(membru.workload)}`}>
                      Workload: {membru.workload}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Proiecte:</h4>
                    <ul className="space-y-1">
                      {membru.proiecte.map((proiect, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          {proiect}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistici */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <Users className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">{responsabilitati.length}</div>
                <div className="text-blue-100">Membri Activi</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
                <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">15</div>
                <div className="text-green-100">Inițiative 2026</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <Target className="w-8 h-8 mb-2 opacity-80" />
                <div className="text-3xl font-bold mb-1">8</div>
                <div className="text-purple-100">Categorii Proiecte</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Parteneri */}
        {activeTab === 'parteneri' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Parteneri Actuali */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Parteneri Actuali
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {parteneri.actuali.map((partener, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{partener.nume}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Țară:</span>
                        <span className="text-gray-600">{partener.tara}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Tip:</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {partener.tip}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Servicii:</span>
                        <p className="text-gray-600 mt-1">{partener.servicii}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parteneri Potențiali */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Parteneri Potențiali
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {parteneri.potentiali.map((partener, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{partener.nume}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Tip:</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          {partener.tip}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Servicii:</span>
                        <p className="text-gray-600 mt-1">{partener.servicii}</p>
                      </div>
                      <div className="pt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(partener.status)}`}>
                          {partener.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pachete Sponsori */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                Pachete Sponsorizare
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {parteneri.sponsori.map((sponsor, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg shadow-lg p-6 text-white ${
                      sponsor.nivel === 'Platinum' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                      sponsor.nivel === 'Gold' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      sponsor.nivel === 'Silver' ? 'bg-gradient-to-br from-gray-400 to-gray-600' :
                      'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}
                  >
                    <h3 className="text-2xl font-bold mb-2">{sponsor.nivel}</h3>
                    <div className="text-lg font-semibold mb-3 opacity-90">{sponsor.buget}</div>
                    <p className="text-sm opacity-90">{sponsor.beneficii}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDocsPage;
