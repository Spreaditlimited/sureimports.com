import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShippingPolicy from '../components/ShippingPolicy'; // Adjust path if needed based on your folder structure

export const metadata: Metadata = {
  title: 'Shipping Policy | Sure Imports',
  description: 'Understand Sure Imports shipping timelines, handling process, and delivery expectations.',
  alternates: {
    canonical: 'https://www.sureimports.com/shipping-policy',
  },
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--si-canvas)]" data-si-page-theme="editorial">
        <ShippingPolicy />
      </main>
      <Footer />
    </>
  );
}
