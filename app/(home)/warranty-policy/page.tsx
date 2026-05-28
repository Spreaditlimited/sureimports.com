import * as React from 'react';
import WarrantyPolicy from '../components/WarrantyPolicy';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warranty Policy',
  description:
    'Review Sure Imports warranty terms for eligible products and support coverage.',
  alternates: {
    canonical: 'https://www.sureimports.com/warranty-policy',
  },
};

const Page: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <WarrantyPolicy />
    </main>
    <Footer />
  </>
);

export default Page;
