import * as React from 'react';
import Home from './components/Home';
import type { Metadata } from 'next';
import { JsonLdScript } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema, generateFAQSchema } from '@/lib/seo/schema';

const baseUrl = 'https://sureimports.com';

export const metadata: Metadata = {
  title: 'Sure Imports - Import from China with Confidence',
  description:
    'Import quality products from China with confidence. Sure Imports guarantees quality, authenticity, and reliable shipping for all your import needs. Start your import business today.',
  keywords: [
    'import from china',
    'china imports nigeria',
    'product sourcing china',
    'china supplier',
    'wholesale from china',
    'import products africa',
    'china procurement services',
    'import business nigeria',
    'quality imports guaranteed',
  ],
  openGraph: {
    title: 'Sure Imports - Import from China with Confidence',
    description:
      'Import quality products from China with confidence. Quality guaranteed, reliable shipping.',
    url: baseUrl,
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sure Imports - Import from China',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sure Imports - Import from China with Confidence',
    description: 'Import quality products from China. Quality guaranteed.',
    images: ['/images/og-image.png'],
  },
  alternates: {
    canonical: baseUrl,
  },
};

// Home page breadcrumb
const homeBreadcrumb = generateBreadcrumbSchema([{ name: 'Home', url: '/' }]);

// FAQ Schema for home page
const homeFAQ = generateFAQSchema([
  {
    question: 'How do I import products from China?',
    answer:
      'With Sure Imports, importing from China is simple. Just tell us what products you need, and we handle everything from sourcing to quality control to shipping directly to your doorstep.',
  },
  {
    question: 'How long does shipping from China take?',
    answer:
      'Shipping typically takes 2-4 weeks depending on the shipping method chosen. We offer both air freight and sea freight options to suit your timeline and budget.',
  },
  {
    question: 'Do you verify product quality before shipping?',
    answer:
      'Yes! Sure Imports performs rigorous quality control inspections on all products before they are shipped to ensure you receive exactly what you ordered.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer:
      'Minimum order quantities vary by product and supplier. Contact us with your requirements and we will find the best options for you.',
  },
  {
    question: 'How do I pay for my imports?',
    answer:
      'We accept multiple payment methods including bank transfers, card payments, and other secure payment options for your convenience.',
  },
]);

const HomePage: React.FC = () => (
  <>
    <JsonLdScript data={[homeBreadcrumb, homeFAQ]} />
    <Home />
  </>
);

export default HomePage;
