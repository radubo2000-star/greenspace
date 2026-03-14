import { useState, useEffect, useRef } from 'react'
import { Calendar, Award, Users, Rocket, Heart, TrendingUp } from 'lucide-react'

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2020',
    title: 'Înființarea Organizației',
    description: 'Am început cu o viziune clară: protecția mediului, educație ecologică și dezvoltarea ecoturismului în regiunea Dunării.',
    icon: <Rocket className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600'
  },
  {
    year: '2021',
    title: 'Program de Voluntariat',
    description: 'Am implementat programul de voluntariat pentru elevii din liceele partenere, oferind certificare conform Legea 78/2014.',
    icon: <Award className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600'
  },
  {
    year: '2022',
    title: 'Extinderea Echipei',
    description: 'Echipa noastră a crescut semnificativ, aducând noi competențe și perspective în protecția mediului.',
    icon: <Users className="w-6 h-6" />,
    color: 'from-green-500 to-green-600'
  },
  {
    year: '2023',
    title: 'Dezvoltare Ecoturism',
    description: 'Am dezvoltat programe de inițiere în ecoturism și caiac, promovând turismul sustenabil pe Dunăre și Argeș.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600'
  },
  {
    year: '2024',
    title: 'Impact Măsurabil',
    description: '5 ecologizări (1220 kg deșeuri), 450+ arbori plantați, 15 acțiuni educative, tabere caiac și drumeții, sprijin umanitar pentru 50 persoane.',
    icon: <Heart className="w-6 h-6" />,
    color: 'from-red-500 to-red-600'
  },
  {
    year: '2025',
    title: 'Consolidare și Expansiune',
    description: '5 ghizi naționali autorizați CNIT, traseu caiac 123 km pe Dunăre, centru pentru tineri, extindere educație ecologică, creștere voluntari și parteneri.',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-teal-500 to-teal-600'
  }
]

const TimelineItem = ({ event, index, isVisible }: { event: TimelineEvent; index: number; isVisible: boolean }) => {
  const isEven = index % 2 === 0

  return (
    <div
      className={`relative flex items-center gap-8 ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      } ${isVisible ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Content card */}
      <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} text-left`}>
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          {/* Decorative corner */}
          <div className={`absolute top-0 ${isEven ? 'right-0' : 'left-0'} w-20 h-20 bg-gradient-to-br ${event.color} opacity-10 ${isEven ? 'rounded-tr-2xl rounded-bl-full' : 'rounded-tl-2xl rounded-br-full'}`} />
          
          <div className="relative">
            {/* Year badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${event.color} text-white font-bold mb-4 shadow-lg`}>
              <Calendar className="w-4 h-4" />
              {event.year}
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-justify">
              {event.description}
            </p>
          </div>

          {/* Bottom accent */}
          <div className={`absolute bottom-0 ${isEven ? 'right-0' : 'left-0'} w-0 h-1 bg-gradient-to-r ${event.color} group-hover:w-full transition-all duration-500 ${isEven ? 'rounded-br-2xl' : 'rounded-bl-2xl'}`} />
        </div>
      </div>

      {/* Center icon */}
      <div className="relative flex-shrink-0 z-10">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
          {event.icon}
        </div>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${event.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`} />
      </div>

      {/* Spacer for alignment */}
      <div className="flex-1 hidden md:block" />
    </div>
  )
}

const Timeline = () => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(timelineEvents.length).fill(false))
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = itemRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        },
        { threshold: 0.2 }
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach(observer => observer?.disconnect())
    }
  }, [])

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Călătoria Noastră</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Evoluția Noastră în Timp
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            De la un vis la o realitate care schimbă vieți. Descoperă momentele cheie care ne-au definit.
          </p>
        </div>

        {/* Timeline line - hidden on mobile */}
        <div className="hidden md:block absolute left-1/2 top-48 bottom-20 w-0.5 bg-gradient-to-b from-primary via-green-500 to-primary" />

        {/* Timeline items */}
        <div className="space-y-16">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              ref={el => itemRefs.current[index] = el}
            >
              <TimelineItem
                event={event}
                index={index}
                isVisible={visibleItems[index]}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-8 md:p-12 bg-gradient-to-br from-primary-600 to-green-600 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-green-400/20 blur-2xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 drop-shadow-lg">
                Scrie Următorul Capitol Împreună cu Noi
              </h3>
              <p className="text-white text-lg mb-8 max-w-xl mx-auto drop-shadow">
                Fiecare contribuție, fiecare voluntar, fiecare poveste contează. Alătură-te misiunii noastre!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="/implica-te"
                  className="px-8 py-4 bg-white text-primary-700 font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-gray-50"
                >
                  Implică-te Acum
                </a>
                <a
                  href="/despre"
                  className="px-8 py-4 bg-transparent text-white font-bold rounded-full border-2 border-white shadow-lg hover:bg-white hover:text-primary-700 transition-all duration-300 hover:scale-105"
                >
                  Află Mai Multe
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timeline
