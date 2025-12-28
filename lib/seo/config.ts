import { Metadata, Viewport } from 'next';

const baseUrl = 'https://www.sureimports.com';
const siteName = 'Sure Imports';

// Default SEO configuration
export const defaultSEO: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Sure Imports | Import from China with Confidence',
    template: '%s | Sure Imports',
  },
  description:
    'Import quality products from China with confidence. Sure Imports guarantees quality, authenticity, and reliable shipping for all your import needs. Start your import business today.',
  keywords: [
    'import from china',
    'china imports',
    'wholesale import',
    'product sourcing',
    'china wholesale',
    'import business',
    'electronics import',
    'gadgets import',
    'china supplier',
    'import export',
    'alibaba import',
    'china products',
    'wholesale electronics',
    'import agent',
    'sourcing agent china',
    'nigeria import',
    'africa import',
    'import to nigeria',
    'china to nigeria',
    'shipping from china',
  ],
  authors: [{ name: 'Sure Imports', url: baseUrl }],
  creator: 'Sure Imports',
  publisher: 'Sure Imports',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: siteName,
    title: 'Sure Imports | Import from China with Confidence',
    description:
      'Import quality products from China with confidence. Sure Imports guarantees quality, authenticity, and reliable shipping for all your import needs.',
    images: [
      {
        url: `${baseUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Sure Imports - Import from China',
        type: 'image/png',
      },
      {
        url: `${baseUrl}/images/svg-logo-white.svg`,
        width: 800,
        height: 600,
        alt: 'Sure Imports Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sure Imports | Import from China with Confidence',
    description:
      'Import quality products from China with confidence. Quality guaranteed.',
    images: [`${baseUrl}/images/og-image.png`],
    creator: '@sureimports',
    site: '@sureimports',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  category: 'business',
};

// Default viewport configuration
export const defaultViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'Sure Imports | Import from China with Confidence',
    description:
      'Import quality products from China with confidence. Sure Imports guarantees quality, authenticity, and reliable shipping. Start your import business today with expert guidance.',
    keywords: [
      'import from china',
      'china imports',
      'wholesale import',
      'product sourcing nigeria',
      'china wholesale',
    ],
  },
  about: {
    title: 'About Us',
    description:
      'Learn about Sure Imports - Your trusted partner for importing quality products from China. Discover our mission, values, and commitment to excellence.',
  },
  blog: {
    title: 'Import Insights Blog',
    description:
      'Expert insights, guides, and tips for importing from China. Learn about product sourcing, shipping, customs, and building a successful import business.',
  },
  contact: {
    title: 'Contact Us',
    description:
      'Get in touch with Sure Imports. Contact our team for import inquiries, support, and partnership opportunities.',
  },
  privacyPolicy: {
    title: 'Privacy Policy',
    description:
      'Read the Sure Imports privacy policy. Learn how we collect, use, and protect your personal information.',
  },
  termsAndConditions: {
    title: 'Terms and Conditions',
    description:
      'Sure Imports terms and conditions. Understand our service terms, policies, and user agreements.',
  },
  shippingPolicy: {
    title: 'Shipping Policy',
    description:
      'Sure Imports shipping policy. Learn about shipping methods, delivery times, and tracking your orders from China.',
  },
  warrantyPolicy: {
    title: 'Warranty Policy',
    description:
      'Sure Imports warranty policy. Understand our product warranties, return policies, and quality guarantees.',
  },
};

// Helper function to generate page metadata
export function generatePageMetadata(
  page: keyof typeof pageSEO,
  additionalMeta?: Partial<Metadata>,
): Metadata {
  const pageConfig = pageSEO[page];

  return {
    title: pageConfig.title,
    description: pageConfig.description,
    openGraph: {
      title: pageConfig.title,
      description: pageConfig.description,
      url: `${baseUrl}/${page === 'home' ? '' : page.replace(/([A-Z])/g, '-$1').toLowerCase()}`,
    },
    twitter: {
      title: pageConfig.title,
      description: pageConfig.description,
    },
    ...additionalMeta,
  };
}

// Helper function to generate blog post metadata
export function generateBlogMetadata(post: {
  title: string;
  excerpt: string;
  slug: string;
  image?: string;
  author?: string;
  publishDate?: string;
}): Metadata {
  return {
    title: post.title,
    description: post.excerpt,
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      images: post.image
        ? [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      publishedTime: post.publishDate,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
    },
  };
}
