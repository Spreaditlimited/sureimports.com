// JSON-LD Structured Data for SEO
// https://schema.org/

const baseUrl = 'https://www.sureimports.com';

// Organization Schema
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'Sure Imports',
  url: baseUrl,
  logo: `${baseUrl}/images/svg-logo-white.svg`,
  description:
    'Import quality products from China with confidence. Sure Imports guarantees quality, authenticity, and reliable shipping for all your import needs.',
  sameAs: [
    'https://www.instagram.com/sureimport',
    'https://www.youtube.com/@sureimports',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+2348037649956',
      contactType: 'customer service',
      areaServed: ['NG', 'GH', 'KE', 'ZA', 'GB', 'US'],
      availableLanguage: ['English'],
    },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5 Olutosin Ajayi Street, Ajao Estate',
    addressLocality: 'Lagos',
    addressCountry: 'NG',
  },
};

// Website Schema
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  name: 'Sure Imports',
  url: baseUrl,
  description:
    'Import quality products from China with confidence. Quality guaranteed.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/shop?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// Local Business Schema (if applicable)
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Sure Imports',
  image: `${baseUrl}/images/svg-logo-white.svg`,
  url: baseUrl,
  telephone: '+2348037649956',
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'Nigeria',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
};

// Service Schema
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Import Services from China',
  provider: {
    '@type': 'Organization',
    name: 'Sure Imports',
    url: baseUrl,
  },
  description:
    'Professional import services from China including product sourcing, quality control, shipping, and customs clearance.',
  areaServed: {
    '@type': 'Country',
    name: 'Nigeria',
  },
  serviceType: 'Import/Export Services',
};

// Blog/Article Schema generator
export function generateArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image || `${baseUrl}/images/sure-imports-social-card.png`,
    author: {
      '@type': 'Person',
      name: article.author || 'Sure Imports Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sure Imports',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/svg-logo-white.svg`,
      },
    },
    url: `${baseUrl}/blog/${article.slug}`,
    datePublished: article.publishDate || new Date().toISOString(),
    dateModified:
      article.modifiedDate || article.publishDate || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${article.slug}`,
    },
  };
}

// FAQ Schema generator
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Breadcrumb Schema generator
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

// Product Schema generator (for shop items)
export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: product.currency || 'NGN',
      price: product.price,
      eligibleRegion: { '@type': 'Country', name: 'Nigeria' },
      ...(product.availability
        ? { availability: `https://schema.org/${product.availability}` }
        : {}),
      seller: {
        '@type': 'Organization',
        name: 'Sure Imports',
      },
    },
  };
}
