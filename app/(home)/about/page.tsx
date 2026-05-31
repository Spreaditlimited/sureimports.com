import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutUs from '../components/AboutUs'; // Adjust path based on your folder structure

export const metadata: Metadata = {
  title: 'About Us | Sure Imports',
  description: 'Learn about Sure Imports, our mission, and how we help businesses source quality products from China.',
  alternates: {
    canonical: 'https://www.sureimports.com/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fcfcfd] pt-48 dark:bg-slate-950">
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}