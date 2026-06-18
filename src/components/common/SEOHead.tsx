import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'LuxeHome - Premium Furniture & Home Decor Brand',
  description = 'Transform your home with LuxeHome\'s curated collection of luxury furniture. Modern design meets exceptional craftsmanship.',
  keywords = 'luxury furniture, premium home decor, modern furniture, scandinavian design, furniture brand',
  image = 'https://luxehome.com/og-image.jpg',
  url = 'https://luxehome.com',
  type = 'website',
  structuredData,
  noIndex = false
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;