import * as React from 'react';
import AboutUs from '../components/AboutUs';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Sure Imports, our mission, and how we help businesses source quality products from China.',
  alternates: {
    canonical: 'https://www.sureimports.com/about',
  },
};

const About: React.FC = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <AboutUs />
    </main>
    <Footer />
  </>
);

export default About;
