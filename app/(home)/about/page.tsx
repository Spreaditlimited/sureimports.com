import GoogleReviews from '@/components/reviews/GoogleReviews';
import * as React from 'react';
import type { Metadata } from 'next';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import pageStyles from '@/components/home/PublicServicePage.module.css';
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
      <main className={pageStyles.page} data-si-page-theme="service">
        <AboutUs />
        <div className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
          <GoogleReviews />
        </div>
      </main>
      <Footer />
    </>
  );
}
