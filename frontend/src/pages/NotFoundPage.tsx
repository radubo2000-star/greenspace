import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        title="404 - Pagina nu a fost gasita"
        description="Pagina pe care o cauti nu exista."
      />
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="text-center max-w-lg">
          <h1 className="text-8xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            Pagina nu a fost gasita
          </h2>
          <p className="text-gray-600 mb-8">
            Ne pare rau, pagina pe care o cauti nu exista sau a fost mutata.
          </p>
          <Link
            to="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors"
          >
            Inapoi la pagina principala
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFoundPage
