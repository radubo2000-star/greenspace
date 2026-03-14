import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Video, Users, Repeat, Radio, ArrowRight, Play } from 'lucide-react'

const GalleryPreview = () => {
  const navigate = useNavigate()

  const features = [
    {
      icon: Video,
      title: 'Stories',
      description: 'Momente speciale din proiectele noastre',
      color: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400'
    },
    {
      icon: Users,
      title: 'Testimoniale Video',
      description: 'Povești inspiraționale de la voluntari',
      color: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400'
    },
    {
      icon: Repeat,
      title: 'Before/After',
      description: 'Transformări vizibile ale zonelor ecologizate',
      color: 'from-green-500 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
    },

    {
      icon: Radio,
      title: 'Live Streams',
      description: 'Evenimente în direct din teren',
      color: 'from-red-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400'
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 w-full max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Video className="w-4 h-4" />
            <span>NOU</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galerie Video & <span className="text-primary-600">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descoperă impactul real al acțiunilor noastre prin imagini, video-uri și povești inspiraționale
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate('/galerie')}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                  {/* Background Image */}
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 transform transition-transform group-hover:scale-105">
                      <Icon className="w-8 h-8 text-white mb-2" />
                      <h3 className="text-white font-bold text-lg mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Proiecte Documentate</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Voluntari Filmați</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
            <div className="text-gray-600">Evenimente Live</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl font-bold text-primary-600 mb-2">200km</div>
            <div className="text-gray-600">Dunăre Explorată</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/galerie')}
            className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span>Explorează Galeria Completă</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default GalleryPreview
