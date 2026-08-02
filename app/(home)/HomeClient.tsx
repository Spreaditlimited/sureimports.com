import * as React from 'react';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustedOrganizations from './components/TrustedOrganizations';
import ServicesSection from './components/ServicesSection';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

export default function HomeClient() {
  return (
    <>
      <Navbar />
      <main>
        <Hero
          title="Get the best products from China at the best prices"
          subtitle="We handle procurement, supplier verification, and fast shipping directly to your doorstep in Africa."
          size="large"
          showCTA
        />
        <TrustedOrganizations />
        <ServicesSection />
        <WhyChooseUs />
        <CustomerReviews />
        <Footer />
      </main>
      <CookieConsent />
    </>
  );
}
