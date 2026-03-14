import { useState, useEffect } from 'react'
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { getActiveTestimonials } from '@/services/testimonial-service'
import { getImagePreview } from '@/lib/image-preview-helper'
import type { Testimonial } from '@/types/testimonial'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      const data = await getActiveTestimonials()
      setTestimonials(data)
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
  }

  const currentTestimonial = testimonials[currentIndex]

  // Show loading state
  if (loading) {
    return (
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary via-green-600 to-green-700 w-full">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Se încarcă testimonialele...</p>
          </div>
        </div>
      </section>
    )
  }

  // Show message if no testimonials
  if (testimonials.length === 0) {
    return null // Don't show section if no testimonials
  }

  // Safety check for current testimonial
  if (!currentTestimonial) {
    return null
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 w-full">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
            <Quote className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Testimoniale</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Poveștile Lor Ne Inspiră
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
            Descoperă cum am schimbat împreună vieți și comunități
          </p>
        </div>

        {/* Testimonial card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transform transition-all duration-500">
            {/* Quote icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-primary to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Quote className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Image */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-xl">
                  <img
                    src={getImagePreview(currentTestimonial.image)}
                    alt={currentTestimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary to-green-600 rounded-full animate-pulse" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-green-600 to-primary rounded-full animate-pulse delay-500" />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Rating */}
                <div className="flex justify-center md:justify-start gap-1 mb-4">
                  {[...Array(currentTestimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl text-gray-800 mb-6 leading-relaxed italic">
                  "{currentTestimonial.quote}"
                </p>

                {/* Author */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-primary font-semibold">
                    {currentTestimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goToPrevious}
              className="group p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 border border-white/20"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? 'w-8 h-3 bg-white'
                      : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="group p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full transition-all duration-300 border border-white/20"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/90 text-lg mb-6">
            Vrei să faci parte din poveștile noastre de succes?
          </p>
          <a
            href="/implica-te"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Alătură-te Comunității
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
