import React from 'react';
import Whysureimports from './buy/whysureimports';
import TestimonialCard from './componenets/ui/TestimonialCard';
import sooner from '@/public/images/sooner.jpg';
import odimba from '@/public/images/odimba.jpg';
import sidney from '@/public/images/sidney.jpg';
import godwin from '@/public/images/godwin.jpg';
import HowBuy from './buy/howBuy';
import ContactForm from './buy/contactForm';
import Banner from './buy/banner';
import icon1 from '@/public/images/work-source-1.svg';
import icon2 from '@/public/images/work-source-2.svg';
import icon3 from '@/public/images/work-source-3.svg';
import icon4 from '@/public/images/work-source-4.svg';
import icon5 from '@/public/images/work-source-5.svg';
import Faq from './componenets/ui/faq';
import HowWorks from './componenets/ui/howWorks';
import ReadyToStart from './buy/readyToStart';
import NavBar from '@/components/home/NavBar';
//import Footer from '@/components/home/Footer';
import Header from '@/app/(home)/components/Navigation';
import Footer from '@/app/(home)/components/Footer';
const Buy = () => {
  const steps = [
    {
      number: '01',
      icon: icon1,
      title: 'Find What You Want',
      description:
        'Go to any Chinese website. Copy the link to the product you want to buy.',
    },
    {
      number: '02',
      icon: icon2,
      title: 'Submit the Link on Sure Imports',
      description:
        'Log into your Sure Imports account, go to Buy From Chinese Websites from the menu, and paste the link. Add any important details (e.g. color, size, quantity).',
    },
    {
      number: '03',
      icon: icon3,
      title: 'You Pay',
      description:
        'Pay in Naira (if you’re in Nigeria) or in USD (if you’re outside Nigeria).',
    },
    {
      number: '04',
      icon: icon4,
      title: 'We Do the Rest',
      description:
        'We’ll handle everything else — including quality checks, repackaging, consolidation, and global shipping.',
    },
    {
      number: '05',
      icon: icon5,
      title: 'Receive Your Goods',
      description:
        'We ship to your doorstep — anywhere in the world. If in Nigeria, your goods would arrive our Lagos office. You pick up or we waybill to you at a separate cost.',
    },
  ];
  const faqs = [
    {
      question: 'Q1: Can I buy from any Chinese website?',
      answer:
        'Apart from Aliexpress (no one buying products to resell should be buying from Aliexpress), we are able to buy from any other website in China. Whether it’s 1688, Taobao, Alibaba, or others, just send us the product link and we’ll take it from there.',
    },
    {
      question: 'Q2: Do I have to speak Chinese?',
      answer:
        'No. You don’t need to speak or type a word of Chinese. Our team communicates with suppliers on your behalf.',
    },
    {
      question: 'Q3: Can I pay in Naira?',
      answer:
        'Yes. Nigerians can pay in Naira via bank transfer or card. International customers can pay in USD.',
    },
    {
      question: 'Q4: What happens if a product is fake or damaged?',
      answer:
        'We verify quality before shipping. If something doesn’t meet your order spec, we’ll flag it and won’t ship until you approve.',
    },
    {
      question: 'Q5: Do you deliver outside Nigeria?',
      answer:
        'Absolutely. We deliver globally — UK, US, Canada, Ghana, and more.',
    },
    {
      question: 'Q6: Is there a minimum order amount?',
      answer:
        'Yes. We process orders that are worth at least N100,000 or $200 if going outside Nigeria from China.',
    },
    {
      question: 'Q7: How long does delivery take?',
      answer:
        'Delivery usually takes 10 to 60 business days after payment, depending on your location and shipping method. Sea shipping takes longer – typically 45 to 60 days when shipment leaves China. Air shipping takes between 5 and 10 business days. ',
    },
    {
      question:
        'Q8: What if the product I want is out of stock, can I get a refund?',
      answer:
        'Absolutely. We have a robust refunds system. You get refund not only when a product is out of stock, but also if our system over-estimated your shipping cost when you placed your order. We run a very transparent system, so you have nothing to worry about.',
    },
  ];
  return (
    <>
      {/* <NavBar /> */}
      <Header />
      <Banner />
      <div>
        <HowBuy />
        <div className="-mt-[181px] mb-[50px] sm:-mt-52 md:-mt-60 md:mb-16 lg:-mt-[181px] xl17:mb-[120px]">
          <TestimonialCard
            name="Boma Sidney"
            location="Nigeria"
            quote="I tested your services for the first time but I was afraid of losing my money but to my greatest surprise, i received my goods. I have not looked back since then. Your service is fast and your support was quick. Thanks for the integrity."
            image={sidney}
            title=""
            backgroundColor="#fff"
            backgroundShadow="0px 2.062px 7.732px rgba(0, 0, 0, 0.10)"
          />
        </div>
      </div>

      
      {/* <Works /> */}
      <HowWorks
        title="How It Works"
        videoUrl="https://www.youtube.com/embed/qpUBdhmVK7c?si=JEUYRPQSxlWWV7_x"
        steps={steps}
        buttonLabel="Submit Sourcing Request"
        buttonUrl="/"
      />
      <Whysureimports />
      <div className="bg-white p-[120px_0px_120px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[50px_0px_25px]">
        <TestimonialCard
          name="Melani Angwo"
          location="USA"
          quote="Wish I had found them sooner. They helped me with sourcing my items, negotiating with vendors and shipping the items to me. They held my hand through the entire process. Highly recommend their services."
          image={sooner}
          title="I wish I found them sooner"
          backgroundColor="#F1F5F9"
        />
      </div>
      <div>
        <ReadyToStart />
        <div className="-mt-[218px] md:-mt-52 lg:-mt-44 xl:-mt-[161px]">
          <TestimonialCard
            name="Chimerenka Odimba"
            location="Nigeria"
            quote="We rely on Sure Importers Limited to bring in products from China to Nigeria for us. This helps reduce cases of fraud for which some Chinese companies are known."
            image={odimba}
            title=""
            backgroundColor="#fff"
            backgroundShadow="10px 10px 10px 0px rgba(0, 0, 0, 0.08)"
          />
        </div>
      </div>
      <Faq
        faqs={faqs}
        title="Frequently Asked Questions (FAQ)"
        initialOpenIndex={0}
      />
      <div className="pb-[50px] md:pb-[70px] xl:pb-[120px]">
        <TestimonialCard
          name="Chimezirim Godwin"
          location="Nigeria"
          quote="Transaction was seamless with effective communication every bit of the way and the delivery came in earlier than expected. Thank you Sure Importers for delivering quality with integrity and trust."
          image={godwin}
          title="Start Buying From China With Zero Stress"
          backgroundColor="#F1F5F9"
        />
      </div>
      <ContactForm />
      <Footer />
    </>
  );
};

export default Buy;
