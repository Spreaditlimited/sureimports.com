'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ServicesSection from './components/ServicesSection';
import WhyChooseUs from './components/WhyChooseUs';
import CustomerReviews from './components/CustomerReviews';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';

export default function HomeClient() {
  const router = useRouter();

  const handleExternalAuth = React.useCallback(() => {
    router.push('/auth/login');
  }, [router]);

  const handleNavigateToPrivacyPolicy = React.useCallback(() => {
    router.push('/privacy-policy');
  }, [router]);

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
        <ServicesSection onNavigateToSignUp={handleExternalAuth} />
        <WhyChooseUs />
        <CustomerReviews onNavigateToSignUp={handleExternalAuth} />
        <Footer />
      </main>
      <CookieConsent
        onNavigateToPrivacyPolicy={handleNavigateToPrivacyPolicy}
      />
    </>
  );
}
