import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WarrantyPolicy from '../components/WarrantyPolicy';

export const metadata: Metadata = {
  title: 'Warranty Policy | Sure Imports',
  description: 'Review Sure Imports warranty terms for eligible products and support coverage.',
  alternates: {
    canonical: 'https://www.sureimports.com/warranty-policy',
  },
};

export default function WarrantyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--si-canvas)]" data-si-page-theme="editorial">
        <WarrantyPolicy />
      </main>
      <Footer />
    </>
  );
}
