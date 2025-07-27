'use client';

import Footer from './components/global/Footer';
import Header from './components/global/Header';
import ScrollToTop from './components/global/ScrollToTop';
import Checkout from './components/home/Checkout';
import Faq from './components/home/Faq';
import Hero from './components/home/Hero';
import PerfectFor from './components/home/PerfectFor';
import ProductFeatures from './components/home/ProductFeatures';
import ReadyToGet from './components/home/ReadyToGet';
import SpecialReseller from './components/home/SpecialReseller';
import TechnicialSpecifications from './components/home/TechnicialSpecifications';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Buy 2M Cable');
  const router = useRouter();

  const handleNavigate = () => {
    setActiveTab('Bulk Buy 2M Cable'); // fixed typo: removed extra space

    router.push('/faya#buy-now');
  };
  return (
    <>
      <main>
        <Hero />
        <ProductFeatures handleNavigate={handleNavigate} />
        <SpecialReseller handleNavigate={handleNavigate} />
        <PerfectFor />
        <TechnicialSpecifications />
        <Checkout activeTab={activeTab} setActiveTab={setActiveTab} />
        <Faq />
        <ReadyToGet />
        <ScrollToTop />
      </main>
    </>
  );
}
