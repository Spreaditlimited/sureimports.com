import * as React from 'react';
// import HeaderSection from '@/components/home/HeaderSection';
// import StreamlineSourcingSection from '@/components/home/streamlineSourcing/StreamlineSourcingSection';
import AffiliateSection from '@/components/home/AffiliateSection';
import ProductSourcingSection from '@/components/home/ProductSourcingSection';
import TrustedBySection2 from '@/components/home/trustedBySection/TrustedBySection2';
import TestimonialsSection from '@/components/home/testimonialsSection/TestimonialsSection';
import StreamlineSourcingSection from '@/components/affiliate/landing/streamlineSourcing/StreamlineSourcingSection';
import HeroSection from '@/components/home/HeroSection';
import NotificationMessage from '@/components/home/NotificationMessage';
import NotificationStrip from '@/components/home/NotificationStrip';

const AffiliatePage: React.FC = () => (
  <div className="flex flex-col">
    <HeroSection />
    <TrustedBySection2 />
    <TestimonialsSection />
    <StreamlineSourcingSection />
    <AffiliateSection />

    {/* <ProductSourcingSection /> */}
  </div>
);

export default AffiliatePage;
