'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import star from '@/public/images/star.svg';
import Link from 'next/link';
import Bluebtn from './ui/bluebtn';

// ⭐ Star rating component
const StarRating: React.FC = () => (
  <div className="mb-[30px] flex gap-[8px] max-lg:mb-[20px]">
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i}>
        <Image src={star} alt="star" />
      </span>
    ))}
  </div>
);

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  message: string;
}

const testimonials1: Testimonial[] = [
  {
    name: 'Mercy Acha',
    role: 'Customer',
    avatar: '/images/reviewprofile1.png',
    message:
      "Their customer service is super cool. The best shipping agents. Even if you're a beginner, they have enough patience to work with you at every step. sure imports, thank you for what you do.",
  },
  {
    name: 'Chimerenka Odimba',
    role: 'Customer',
    avatar: '/images/reviewprofile2.png',
    message:
      'We rely on Sure imports to bring in products from China to Nigeria for us. This helps reduce cases of fraud for which some Chinese companies are known.',
  },
  {
    name: 'Mercy Odimba',
    role: 'Customer',
    avatar: '/images/reviewprofile3.png',
    message:
      "If you want peace of mind that your goods will be delivered without stories, sure imports is it. We are proud to say that we are sure imports’ first customer and haven't still found a good reason to change to another agent or platform after all these years.",
  },
];

const testimonials2: Testimonial[] = [
  {
    name: 'Chioma Ifeanyi-Eze',
    role: 'Customer',
    avatar: '/images/reviewprofilemain.png',
    message:
      'You want to import equipment? You want to source anything in China? You are so afraid of being defrauded. You just want an honest upright truthful sensible person. You want a person who will listen and execute every line of the agreement. You want a person who is deeply knowledgeable and not audio. You want a person whose integrity allows you pay him 100 million and go to sleep. You want a person who has a team (not audio) in China. You want a person with a brain who can make suggestions and guide you. Nwannem, run to Nkwocha Tochukwu (CEO of Sure Imports Limited). Pay him your money. Buy popcorn, cross leg and chop. Sleep with 2 eyes closed. Kobo no go miss.',
  },
  {
    name: 'Martins Ohiarebu Airende',
    role: 'Customer',
    avatar: '/images/reviewprofile5.png',
    message:
      "I recently had an outstanding experience with sure imports and I can't recommend them enough! When I encountered an issue with my phone, they responded promptly and efficiently, retrieving the faulty device and replacing it without any hassle. Moreover, their seamless product procurement service made my shopping experience a breeze.",
  },
];

const testimonials3: Testimonial[] = [
  {
    name: 'Aniebiet Inyang',
    role: 'Customer',
    avatar: '/images/reviewimg.png',
    message:
      'Top-notch service, with prompt delivery of gadgets and products. sure imports has restored my faith in online purchases; they practice what they preach.',
  },
  {
    name: 'Emmanuel Atsu',
    role: 'Customer',
    avatar: '/images/reviewprofile6.png',
    message:
      'When it comes to trust & deliverability, sure imports is that choice. Make your procurement and still...',
  },
  {
    name: 'Nimi Jenakumo',
    role: 'Customer',
    avatar: '/images/reviewprofile7.png',
    message:
      "In a world where when it comes to money people are full of unpleasant surprises Sure Imports chose to be different. I'll recommend them over and ove..",
  },
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({
  testimonial,
}) => (
  <div className="card-block mb-[30px] w-full rounded-[30px] bg-store-lightskyblue p-[40px_30px_40px] text-gray-800 max-xl:p-[30px_20px] max-lg:mb-[15px] max-md:mb-[30px] max-sm:mb-[10px] max-sm:rounded-[20px] max-sm:p-[30px_20px]">
    <StarRating />
    <p className="mb-[40px] text-[16px] font-normal leading-[150%] text-black max-lg:mb-[20px] max-lg:text-[14px] max-sm:text-[16px] max-[420px]:text-[15px]">
      {testimonial.message}
    </p>
    <div className="mt-auto flex items-center gap-3">
      {testimonial.avatar ? (
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="h-[58px] w-[58px] rounded-full object-cover max-xl:h-[45px] max-xl:w-[45px] max-lg:h-[30px] max-lg:w-[30px] max-sm:h-[50px] max-sm:w-[50px]"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
          {testimonial.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
      )}
      <div>
        <p className="text-[18px] font-medium leading-[166%] text-black max-xl:text-[15px] max-lg:text-[13px] max-lg:leading-[125%] max-sm:text-[16px] max-[420px]:text-[14px]">
          {testimonial.name}
        </p>
        <p className="text-[16px] font-normal leading-[166%] text-black max-xl:text-[15px] max-lg:text-[13px] max-lg:leading-[125%] max-sm:text-[16px] max-[420px]:text-[14px]">
          {testimonial.role}
        </p>
      </div>
    </div>
  </div>
);

interface TestimonialColumnProps {
  items: Testimonial[];
  direction?: 'up' | 'down';
  duration?: number;
}

const TestimonialColumn: React.FC<TestimonialColumnProps> = ({
  items,
  direction = 'up',
  duration = 120,
}) => {
  const animateY = direction === 'up' ? ['0%', '-50%'] : ['-50%', '0%'];
  const repeatedItems = Array(6).fill(items).flat();

  return (
    <div className="relative h-full w-[100%] overflow-hidden max-md:mb-[0px] max-md:h-auto max-md:overflow-visible">
      <motion.div
        className="absolute flex flex-col max-md:relative max-md:mb-[0px]"
        animate={{ y: animateY }}
        transition={{
          duration,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {repeatedItems.map((item, i) => (
          <TestimonialCard key={i} testimonial={item} />
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialMarquee: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const testimonials4 = [...testimonials1, ...testimonials2, ...testimonials3];

  return (
    <div className="p-[120px_0px_75px] max-xl17:p-[60px_0px_20px] max-xl15:p-[60px_0px_10px] max-xl:p-[50px_0px_10px] max-lg:p-[40px_0px_10px] max-sm:p-[50px_0px_0px]">
      <div>
        <div className="px-[30px] max-sm:px-[20px]">
          <div className="fix-width">
            <div className="relative z-[999] mb-[30px] flex items-center justify-between max-lg:flex-col">
              <div className="max-lg:max-w-[350px]">
                <div className="mb-[15px] max-lg:text-center">
                  <h2 className="gradient-text inline-block text-[42px] font-semibold capitalize leading-normal max-xl:text-[36px] max-[420px]:text-[28px]">
                    More Reviews From Real Customers
                  </h2>
                </div>
                <div>
                  <p className="hidden font-medium leading-[166%] text-black max-lg:text-center">
                    (
                    <Link href="/" className="text-[#0053D0] underline">
                      Suremports.com
                    </Link>{' '}
                    was formerly{' '}
                    <Link
                      href="https://spreaditglobal.com"
                      className="text-[#0053D0] underline"
                    >
                      Spreaditglobal.com
                    </Link>
                    )
                  </p>
                </div>
              </div>
              <div className="relative z-[9999] max-lg:mt-[20px]">
                <Bluebtn
                  text="Browse Phones & Laptops Now"
                  className="p-[12px_25px!important] max-sm:p-[12px_18px!important] max-sm:!text-[14px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="testimonial-section relative">
          <div className="px-[30px] max-sm:px-[20px]">
            <div className="fix-width">
              <div className="flex h-[1000px] w-full flex-col items-start justify-center gap-[30px] overflow-hidden max-lg:gap-[15px] max-md:gap-[0px] md:flex-row">
                {!isMobile ? (
                  <>
                    <TestimonialColumn items={testimonials1} direction="up" />
                    <TestimonialColumn items={testimonials2} direction="down" />
                    <TestimonialColumn items={testimonials3} direction="up" />
                  </>
                ) : (
                  <TestimonialColumn items={testimonials4} direction="up" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialMarquee;
