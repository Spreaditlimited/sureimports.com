import * as React from 'react';
import ShippingPolicy from '../components/ShippingPolicy';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Understand Sure Imports shipping timelines, handling process, and delivery expectations.',
  alternates: {
    canonical: 'https://www.sureimports.com/shipping-policy',
  },
};

const Page: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <ShippingPolicy />
    </main>
    <Footer />
  </>
);

export default Page;
