import Header from '../components/Header'
import Hero from '../components/Hero'
import ImpactCounter from '../components/ImpactCounter'
import Testimonials from '../components/Testimonials'
import GalleryPreview from '../components/GalleryPreview'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'

const HomePage = () => {
  return (
    <>
      <SEO />
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <ImpactCounter />
        <Testimonials />
        <GalleryPreview />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
