import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Users, 
  Building2, 
  GraduationCap,
  Heart,
  Sun,
  School,
  MapPin,
  Recycle,
  TreePine,
  Droplets,
  Tent,
  ChevronDown,
  ChevronRight,
  Calendar,
  Target
} from 'lucide-react'

interface Activity {
  name: string
  description: string
  icon: any
}

interface Project {
  name: string
  description: string
  activities: Activity[]
  icon: any
  color: string
  bgColor: string
}

interface Program {
  id: string
  name: string
  description: string
  icon: any
  color: string
  projects: Project[]
}

const ProgramsProjects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [expandedProgram, setExpandedProgram] = useState<string | null>('program-voluntariat')
  const [expandedProjects, setExpandedProjects] = useState<{ [key: string]: boolean }>({})

  const programs: Program[] = [
    {
      id: 'program-voluntariat',
      name: 'Program Voluntariat',
      description: 'Voluntarii reprezintă cea mai importantă resursă a asociației noastre. Aceștia provin din rândul elevilor din comunitate și sunt implicați activ în toate acțiunile pe care le desfășurăm. Ne-am propus să implicăm peste 100 de elevi în proiectele noastre.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      projects: [
        {
          name: 'Ecologizări',
          description: 'Intervenim asupra mediului natural prin igienizarea unor zone sălbatice afectate de poluare cu deșeuri provenite din activități de agrement desfășurate într-un mod iresponsabil.',
          icon: Recycle,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          activities: [
            {
              name: 'Ecologizare Argeș',
              description: 'Curățarea malurilor râului Argeș',
              icon: Droplets
            },
            {
              name: 'Ecologizare Dunăre',
              description: 'Curățarea zonelor de vărsare în Dunăre',
              icon: Droplets
            },
            {
              name: 'Ecologizare zone sălbatice',
              description: 'Igienizarea zonelor afectate de poluare',
              icon: MapPin
            }
          ]
        },
        {
          name: 'Plantări / Împăduriri',
          description: 'Promovăm și sprijinim acțiunile de împădurire și crearea de perdele forestiere, în parteneriat cu primăriile din comunitate, direcțiile și ocoalele silvice, precum și cu sprijinul partenerilor din domeniul privat.',
          icon: TreePine,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          activities: [
            {
              name: 'Plantări cu Ocolul Silvic',
              description: 'Campanii de plantare în parteneriat cu Ocolul Silvic Mitreni',
              icon: TreePine
            },
            {
              name: 'Perdele forestiere',
              description: 'Crearea de perdele forestiere în comunitate',
              icon: TreePine
            },
            {
              name: 'Regenerare zone verzi',
              description: 'Refacerea ecosistemelor naturale',
              icon: TreePine
            }
          ]
        },
        {
          name: 'Studii Ecologice',
          description: 'Ne-am propus echiparea laboratoarelor școlare (chimie și biologie) cu echipamente care permit inițierea unor studii asupra solului, apelor și izvoarelor, precum și promovarea rezultatelor în spațiul public.',
          icon: Droplets,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          activities: [
            {
              name: 'Studii sol',
              description: 'Analize și monitorizare calitate sol',
              icon: Target
            },
            {
              name: 'Studii ape',
              description: 'Monitorizare calitate ape și izvoare',
              icon: Droplets
            },
            {
              name: 'Echipare laboratoare',
              description: 'Dotarea laboratoarelor școlare cu echipamente',
              icon: School
            }
          ]
        },
        {
          name: 'Umanitar',
          description: 'În pragul sărbătorilor și atunci când suntem sesizați, ne mobilizăm pentru a acorda sprijin de natură materială pentru familii nevoiase din comunitate, prin inițierea de campanii de tip "fundraising".',
          icon: Heart,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          activities: [
            {
              name: 'Campanii fundraising',
              description: 'Strângere de fonduri pentru familii nevoiașe',
              icon: Heart
            },
            {
              name: 'Sprijin sărbători',
              description: 'Ajutor material în pragul sărbătorilor',
              icon: Heart
            },
            {
              name: 'Intervenții urgente',
              description: 'Răspuns rapid la sesizări din comunitate',
              icon: Heart
            }
          ]
        },
        {
          name: 'FUNDRAISING: Școala de Vară',
          description: 'În vacanța de vară, copiii din comunitate au oportunitatea de a participa la activități educative alături de voluntarii asociației, în cadrul Școlii de Vară A.G.S. Aceasta reprezintă totodată una dintre activitățile noastre de autofinanțare, prin care susținem dezvoltarea și continuitatea proiectelor noastre.',
          icon: Sun,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          activities: [
            {
              name: 'Ateliere educative',
              description: 'Activități educative interactive pentru copii',
              icon: School
            },
            {
              name: 'Activități în aer liber',
              description: 'Jocuri și activități outdoor',
              icon: Tent
            },
            {
              name: 'Workshopuri creative',
              description: 'Ateliere de artă și creativitate',
              icon: Target
            }
          ]
        },
        {
          name: 'Promovarea Zonei',
          description: 'Comunitatea noastră dispune de multiple posibilități de agrement. Având la bază practici sustenabile, organizăm activități de tip caiac, tabere pentru elevi și sport în aer liber.',
          icon: MapPin,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          activities: [
            {
              name: 'Ture cu caiacul',
              description: 'Activități de caiac pe Argeș și Dunăre',
              icon: Droplets
            },
            {
              name: 'Tabere pentru elevi',
              description: 'Tabere educaționale în natură',
              icon: Tent
            },
            {
              name: 'Sport în aer liber',
              description: 'Activități sportive outdoor',
              icon: Target
            }
          ]
        },
        {
          name: 'Eco Ambasadori',
          description: 'Urmărim să inițiem cât mai mulți tineri din comunitate în drumeții montane și ture cu caiacul. În acest sens, organizăm tabere de inițiere pe caiac și îi implicăm direct în proiecte de ecoturism, oferindu-le oportunități de învățare practică și implicare.',
          icon: Users,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          activities: [
            {
              name: 'Drumeții montane',
              description: 'Inițiere în drumeții și hiking',
              icon: MapPin
            },
            {
              name: 'Tabere inițiere caiac',
              description: 'Învățarea tehnicilor de caiac',
              icon: Droplets
            },
            {
              name: 'Proiecte ecoturism',
              description: 'Implicare în proiecte de turism sustenabil',
              icon: Target
            }
          ]
        }
      ]
    },
    {
      id: 'hub-comunitar',
      name: 'HUB Comunitar Tineret',
      description: 'Împreună cu instituțiile și autoritățile publice locale, am urmărit identificarea și amenajarea unui spațiu dedicat tinerilor din comunitate. Acesta ar fi funcționat ca un incubator de activități, oferind multiple oportunități de dezvoltare personală și profesională, inclusiv inițierea și implementarea unor proiecte de tip Erasmus+ sau similare.',
      icon: Building2,
      color: 'from-purple-500 to-pink-500',
      projects: [
        {
          name: 'Amenajare Spațiu',
          description: 'Identificarea și amenajarea unui spațiu dedicat tinerilor din comunitate care să funcționeze ca incubator de activități.',
          icon: Building2,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          activities: [
            {
              name: 'Identificare locație',
              description: 'Colaborare cu autoritățile locale pentru găsirea spațiului',
              icon: MapPin
            },
            {
              name: 'Amenajare interioară',
              description: 'Dotarea și amenajarea spațiului pentru activități',
              icon: Building2
            },
            {
              name: 'Echipare tehnică',
              description: 'Dotarea cu echipamente necesare activităților',
              icon: Target
            }
          ]
        },
        {
          name: 'Proiecte Erasmus+',
          description: 'Inițierea și implementarea de proiecte de tip Erasmus+ pentru tinerii din comunitate.',
          icon: GraduationCap,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          activities: [
            {
              name: 'Pregătire aplicații',
              description: 'Suport pentru pregătirea aplicațiilor Erasmus+',
              icon: GraduationCap
            },
            {
              name: 'Mobilități internaționale',
              description: 'Organizare schimburi de experiență',
              icon: MapPin
            },
            {
              name: 'Training-uri',
              description: 'Organizare training-uri pentru tineri',
              icon: Target
            }
          ]
        }
      ]
    },
    {
      id: 'pro-scoala',
      name: 'PRO Școala',
      description: 'Reprezintă pregătirea cadrelor didactice din mediul rural în vederea obținerii titularizării sau a creșterii performanțelor didactice prin organizarea de cursuri gratuite cu parteneri externi specializați. Încurajăm metodele noi de predare și activitățile extrașcolare.',
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-500',
      projects: [
        {
          name: 'Educațional',
          description: 'În cadrul unităților școlare partenere din comunitate, desfășurăm diferite activități pe teme ecologice, precum: ateliere din materiale reutilizate, ecologizări și workshopuri pe diverse teme educative.',
          icon: School,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          activities: [
            {
              name: 'Ateliere materiale reutilizate',
              description: 'Crearea de obiecte din materiale reciclate',
              icon: Recycle
            },
            {
              name: 'Workshopuri ecologice',
              description: 'Educație pe teme de mediu',
              icon: School
            },
            {
              name: 'Ecologizări școlare',
              description: 'Curățarea și îngrijirea spațiilor școlare',
              icon: Recycle
            }
          ]
        }
      ]
    }
  ]

  const toggleProgram = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId)
  }

  const toggleProject = (projectKey: string) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectKey]: !prev[projectKey]
    }))
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-semibold">
              Programele Noastre
            </span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Programe, Proiecte & Activități
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base md:text-lg">
            Descoperă structura completă a inițiativelor noastre
          </p>
        </motion.div>

        {/* Programs List */}
        <div className="max-w-6xl mx-auto space-y-6">
          {programs.map((program, programIndex) => {
            const ProgramIcon = program.icon
            const isExpanded = expandedProgram === program.id

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: programIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                {/* Program Header */}
                <button
                  onClick={() => toggleProgram(program.id)}
                  className="w-full p-6 md:p-8 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex-shrink-0 p-4 bg-gradient-to-br ${program.color} rounded-xl`}>
                    <ProgramIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {program.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-justify">
                      {program.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-primary-600 font-semibold">
                      <span>{program.projects.length} Proiecte</span>
                      <span>•</span>
                      <span>{program.projects.reduce((acc, p) => acc + p.activities.length, 0)} Activități</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </button>

                {/* Projects List */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-6 md:p-8 space-y-4 bg-gray-50">
                      {program.projects.map((project, projectIndex) => {
                        const ProjectIcon = project.icon
                        const projectKey = `${program.id}-${projectIndex}`
                        const isProjectExpanded = expandedProjects[projectKey]

                        return (
                          <div
                            key={projectIndex}
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                          >
                            {/* Project Header */}
                            <button
                              onClick={() => toggleProject(projectKey)}
                              className="w-full p-4 md:p-6 flex items-start gap-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className={`flex-shrink-0 p-3 ${project.bgColor} rounded-lg`}>
                                <ProjectIcon className={`w-6 h-6 ${project.color}`} />
                              </div>
                              <div className="flex-1 text-left">
                                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                                  {project.name}
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed text-justify">
                                  {project.description}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                  <Target className="w-4 h-4" />
                                  <span>{project.activities.length} Activități</span>
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: isProjectExpanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex-shrink-0"
                              >
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              </motion.div>
                            </button>

                            {/* Activities List */}
                            {isProjectExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-t border-gray-100 bg-gray-50"
                              >
                                <div className="p-4 md:p-6 space-y-3">
                                  {project.activities.map((activity, activityIndex) => {
                                    const ActivityIcon = activity.icon
                                    return (
                                      <motion.div
                                        key={activityIndex}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: activityIndex * 0.05 }}
                                        className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100"
                                      >
                                        <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                                          <ActivityIcon className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <div className="flex-1">
                                          <h5 className="font-semibold text-gray-900 mb-1">
                                            {activity.name}
                                          </h5>
                                          <p className="text-sm text-gray-600">
                                            {activity.description}
                                          </p>
                                        </div>
                                      </motion.div>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-600 mb-6 text-base md:text-lg">
            Vrei să te implici în programele noastre?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/implica-te"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-primary-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              Devino Voluntar
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              <Calendar className="w-5 h-5" />
              Contactează-ne
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProgramsProjects
