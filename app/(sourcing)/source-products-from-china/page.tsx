import React from 'react';
import Image from 'next/image';
import client from '@/public/images/client.jpg';
import TakeFirstStep from './sourcing/TakeFirstStep';
import Faq from './componenets/ui/faq';
import ReadyToPro from './sourcing/readyToPro';
import PerfectService from './sourcing/perfectService';
import Testimonial from './sourcing/testimonial';
import Commitment from './sourcing/commitment';
import Different from './sourcing/different';
import Hero from './sourcing/hero';
import TestimonialCard from './componenets/ui/TestimonialCard';
import icon1 from '@/public/images/work-source-1.svg';
import icon2 from '@/public/images/work-source-2.svg';
import icon3 from '@/public/images/work-source-3.svg';
import icon4 from '@/public/images/work-source-4.svg';
import icon5 from '@/public/images/work-source-5.svg';
import icon6 from '@/public/images/work-source-6.svg';
import icon7 from '@/public/images/work-source-7.svg';
import Card from './sourcing/card';
import HowWorks from './componenets/ui/howWorks';
import WomenBusinessSlider from './sourcing/womenBusinessSlider';
import Footer from '@/components/home/Footer';
import NavBar from '@/components/home/NavBar';
const Sourcing = () => {
  const steps = [
    {
      number: '01',
      icon: icon1,
      title: 'Create a free account',
      description:
        'This is super easy. Simply click any of the buttons on this page to register. Its free. And when signed in, go to Special sourcing from the menu.',
    },
    {
      number: '02',
      icon: icon2,
      title: 'Tell Us What You Want',
      description:
        'Describe the exact product you want — whether it’s an existing product or something custom.',
    },
    {
      number: '03',
      icon: icon3,
      title: 'Pay a Refundable Commitment Fee',
      description:
        'This is a one-time sourcing fee that shows you’re serious. We refund this when you go ahead with the order.',
    },
    {
      number: '04',
      icon: icon4,
      title: 'We Create a Private WhatsApp Group',
      description:
        'You’ll be added to a private group with our China sourcing team and your dedicated Sure Imports rep.',
    },
    {
      number: '05',
      icon: icon5,
      title: 'We Get to Work',
      description:
        'Our team will negotiate, verify, brand, and package your product, exactly how you want it.',
    },
    {
      number: '06',
      icon: icon6,
      title: 'We Guarantee It',
      description:
        'Every product we source is backed by our guarantee. If anything goes wrong — we refund or replace.',
    },
    {
      number: '07',
      icon: icon7,
      title: 'We Ship to Any Country',
      description:
        'From China to Nigeria, the UK, US, Ghana, or anywhere else — we handle logistics end-to-end.',
    },
  ];

  const faqs = [
    {
      question: 'Q1: How much is the sourcing commitment fee?',
      answer:
        '$50 or N50,000. It’s fully refundable once you proceed with the order.',
    },
    {
      question: 'Q2: What if I don’t go ahead with the order?',
      answer:
        'The fee is not refunded if you cancel. It covers the resources already spent on your request.',
    },
    {
      question: 'Q3: How long does it take to find suppliers?',
      answer:
        'Usually within 48 – 96 hours, depending on how complex or custom the product is.',
    },
    {
      question: 'Q4: Can I brand the products?',
      answer:
        'Yes. We help with white labeling, OEM production, and full product customization — including packaging.',
    },
    {
      question: 'Q5: Will I speak to the suppliers directly?',
      answer:
        'No. We handle all supplier interactions, but you’ll have direct access to our China team who manage everything.',
    },
    {
      question: 'Q6: What if something goes wrong with my order?',
      answer:
        'We replace or refund any product that doesn’t meet your approved specification. That’s our product guarantee.',
    },
    {
      question: 'Q7: Do you ship internationally?',
      answer:
        'Yes! We deliver to Nigeria, UK, US, Canada, Ghana, and many other countries.',
    },
  ];

  return (
    <>
      <NavBar />
      <Hero />
      <WomenBusinessSlider />
      <section className="p-[60px_0px_120px] max-xl17:p-[25px_0px_50px] max-xl:p-[30px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[25px_0px_25px]">
        <Card />
      </section>

      {/* <Works /> */}

      <HowWorks
        title="Here’s How It Works"
        videoUrl="https://www.youtube.com/embed/9TG0g3nOknQ?si=hMTjaa9bxzWbbw6H"
        steps={steps}
        buttonLabel="Submit Sourcing Request"
        buttonUrl="/"
      />

      <Different />

      <Commitment />

      <Testimonial />

      <PerfectService />

      <ReadyToPro />

      <Faq
        faqs={faqs}
        title="Frequently Asked Questions (FAQ)"
        initialOpenIndex={0}
      />

      <TakeFirstStep />
      <Footer />
    </>
  );
};

export default Sourcing;
