import { useEffect, useState, useRef } from 'react'
import { Users, Heart, Award, Sprout } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStatistics } from '../hooks/use-statistics'

interface CounterItemProps {
  icon: React.ReactNode
  end: number
  label: string
  suffix?: string
  duration?: number
}

const CounterItem = ({ icon, end, label, suffix = '', duration = 2000 }: CounterItemProps) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  return (
    <div
      ref={counterRef}
      className="group relative flex flex-col items-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon container */}
      <div className="relative mb-4 p-5 rounded-full bg-gradient-to-br from-purple-600 to-green-600 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
        <div className="text-white relative z-10">
          {icon}
        </div>
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl group-hover:blur-2xl transition-all duration-500" />
      </div>

      {/* Counter */}
      <div className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-primary-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-500">
        {count.toLocaleString('ro-RO')}{suffix}
      </div>

      {/* Label */}
      <div className="relative text-gray-600 font-medium text-center">
        {label}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-primary to-green-500 group-hover:w-3/4 transition-all duration-500 rounded-full" />
    </div>
  )
}

const ImpactCounter = () => {
  const { getSummary: summary, loading } = useStatistics()
  
  return (
    <section id="impact" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-green-50 w-full">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 mb-4">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Impactul Nostru</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Schimbăm Vieți Împreună
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fiecare număr reprezintă o poveste, o viață schimbată, un pas către un viitor mai bun
          </p>
        </div>

        {/* Counters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {!loading && (
            <>
              <CounterItem
                icon={<Users className="w-8 h-8" />}
                end={summary.roundedVolunteers}
                suffix="+"
                label="Voluntari Activi"
                duration={2500}
              />
              <CounterItem
                icon={<Heart className="w-8 h-8" />}
                end={summary.roundedParticipants}
                suffix="+"
                label="Participanți"
                duration={2800}
              />
              <CounterItem
                icon={<Award className="w-8 h-8" />}
                end={summary.roundedProjects}
                suffix="+"
                label="Proiecte Finalizate"
                duration={2200}
              />
              <CounterItem
                icon={<Sprout className="w-8 h-8" />}
                end={summary.roundedPlantingEvents}
                suffix="+"
                label="Evenimente de Plantare"
                duration={2000}
              />
            </>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4 text-base md:text-lg">
            Vrei să faci parte din aceste statistici?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/implica-te"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold hover:from-primary-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              Implică-te Acum
            </motion.a>
            <motion.a
              href="/despre"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl border border-gray-200"
            >
              Află Mai Multe
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImpactCounter
