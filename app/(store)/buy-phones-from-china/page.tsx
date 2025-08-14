'use client';

import { useEffect, useState } from 'react';
import Banner from './componenets/banner';
import Buynow from './componenets/buynow';
import Guarantee from './componenets/guarantee';
import Pay from './componenets/ui/pay';
import Getstarted from './componenets/getstarted';
import Whysureimports from './componenets/whysureimports';
import Faq from './componenets/faq';
import TestimonialMarquee from './componenets/review';
import Browse from './componenets/browse';
import Realreview from './componenets/realreview';
import RealMobilereview from './componenets/realmobilereview';


const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 'sm' breakpoint
    };

    handleResize(); // set on load
    window.addEventListener('resize', handleResize); // update on resize

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Banner />
      {isMobile && <Realreview />}
      <Buynow />
      <Guarantee />
      <Pay />
      <Getstarted />
      {!isMobile && <Realreview />}
      {isMobile && <RealMobilereview />}
      <Whysureimports />
      <TestimonialMarquee />
      <Faq />
      <Browse />
    </>
  );
};

export default Home;
