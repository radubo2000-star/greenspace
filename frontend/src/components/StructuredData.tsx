import { Helmet } from 'react-helmet-async'

const StructuredData = () => {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Asociația Green Space',
    alternateName: 'Green Space',
    url: 'https://asociatiagreenspace.ro',
    logo: 'https://asociatiagreenspace.ro/favicon.svg',
    description: 'Organizație non-profit dedicată protejării mediului și promovării sustenabilității în România',
    email: 'contact@greenspace.ro',
    telephone: '+40123456789',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Str. Naturii nr. 1',
      addressLocality: 'București',
      addressCountry: 'RO',
    },
    sameAs: [
      'https://www.facebook.com/asociatiagreenspace',
      'https://www.instagram.com/asociatiagreenspace',
      'https://www.linkedin.com/company/asociatiagreenspace',
      'https://twitter.com/greenspace',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'România',
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Asociația Green Space',
    url: 'https://asociatiagreenspace.ro',
    description: 'Site oficial al Asociației Green Space',
    inLanguage: 'ro-RO',
  }

  const nonprofitSchema = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Asociația Green Space',
    description: 'Protejăm natura și promovăm sustenabilitatea în România',
    url: 'https://asociatiagreenspace.ro',
    foundingDate: '2014',
    knowsAbout: [
      'Protecția mediului',
      'Sustenabilitate',
      'Plantări puieți',
      'Educație ecologică',
      'Conservarea naturii',
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(nonprofitSchema)}
      </script>
    </Helmet>
  )
}

export default StructuredData
