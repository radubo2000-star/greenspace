import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
}

const SEO = ({
  title = 'Asociația Green Space - Protejăm Natura, Construim Viitorul',
  description = 'Asociația Green Space este o organizație non-profit dedicată protejării mediului și promovării unui stil de viață sustenabil în România. Alătură-te misiunii noastre!',
  keywords = 'mediu, ecologie, sustenabilitate, natură, România, green space, asociație, voluntariat, plantări puieți, protejarea mediului',
  image = '/og-image.jpg',
  url = 'https://asociatiagreenspace.ro',
}: SEOProps) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Romanian" />
      <meta name="author" content="Asociația Green Space" />
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEO
