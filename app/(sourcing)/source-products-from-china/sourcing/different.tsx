'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import diff1 from '@/public/images/diff1.jpg';
import diff2 from '@/public/images/diff2.jpg';
import diff3 from '@/public/images/diff3.jpg';
import diff4 from '@/public/images/diff4.jpg';
import diff5 from '@/public/images/diff5.jpg';
import diff6 from '@/public/images/diff6.jpg';
import diffIcon1 from '@/public/images/diffIcon1.svg';
import diffIcon2 from '@/public/images/diffIcon2.svg';
import diffIcon3 from '@/public/images/diffIcon3.svg';
import diffIcon4 from '@/public/images/diffIcon4.svg';
import diffIcon5 from '@/public/images/diffIcon5.svg';
import diffIcon6 from '@/public/images/diffIcon6.svg';
import linkArrow from '@/public/images/linkArrow.svg';

const Different = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const differences = [
    {
      image: diff1,
      icon: diffIcon1,
      title: '100% Product Guarantee',
      description: 'If we source it, we stand by it.',
    },
    {
      image: diff2,
      icon: diffIcon2,
      title: 'Real-Time Access',
      description:
        'Talk directly to our China-based sourcing team via WhatsApp.',
    },
    {
      image: diff3,
      icon: diffIcon3,
      title: 'Private & Personal',
      description: 'One customer. One group. Full attention.',
    },
    {
      image: diff4,
      icon: diffIcon4,
      title: 'Custom Branding & Packaging',
      description: 'We handle OEM, white labeling, and product customization.',
    },
    {
      image: diff5,
      icon: diffIcon5,
      title: 'Worldwide Shipping',
      description: 'No matter where you are, we’ll get it to you.',
    },
    {
      image: diff6,
      icon: diffIcon6,
      title: 'Full-Service Logistics',
      description: 'From factory floor to your door — we manage it all.',
    },
  ];
  return (
    <section className="relative p-[120px_0px_120px] max-xl17:p-[50px_0px_40px] max-xl:p-[40px_0px_30px] max-lg:p-[30px_0px_10px] max-sm:p-[50px_0px_50px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <h3
            data-aos="fade-up"
            className="gradient-text text-center text-[42px] font-semibold capitalize leading-snug text-white max-xl:text-[26px] max-sm:text-[36px] max-[360px]:text-[30px]"
          >
            What Makes This <br className="block sm:hidden" /> Different?
          </h3>
          <div
            data-aos="fade-up"
            className="mt-[30px] grid grid-cols-12 gap-5 max-xl:gap-[20px] max-sm:mt-[30px] xl:mt-[50px] xl:gap-[30px]"
          >
            {differences.map((item, index) => (
              <div
                key={index}
                className="col-span-full sm:col-span-6 lg:col-span-4"
              >
                <div className="relative h-full">
                  <div className="relative h-[260px] md:h-[307px]">
                    <Image
                      src={item.image}
                      alt="image"
                      className="h-full w-full rounded-[30px] object-cover"
                    />
                  </div>
                  <div className="mx-auto -mt-[54px] h-full w-[93%] md:-mt-[71px]">
                    <div className="relative flex h-[calc(100%-206px)] w-full gap-5 rounded-[20px] bg-white p-5 shadow-customboxshadow max-[420px]:gap-4 max-[420px]:px-4 md:h-[calc(100%-236px)] xl:p-7">
                      <Image
                        src={item.icon}
                        alt="icon"
                        className="size-6 max-[420px]:size-5 xl:size-7"
                      />
                      <div>
                        <p className="text-darkblack mb-[10px] text-lg font-semibold max-sm:leading-tight max-[420px]:text-base sm:mb-3 xl:text-xl">
                          {item.title}
                        </p>
                        <span className="text-gray text-base font-normal max-[420px]:text-sm">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div data-aos="fade-up" className="mt-8 md:mt-12">
            <Link
              href={'/auth/signup-sourcing'}
              className="mx-auto flex w-fit items-center justify-center gap-[10px] rounded-[30px] bg-buy-sourcing-blue p-[10px_30px] text-base font-medium leading-[155%] text-white transition-all hover:bg-indigo-700 max-sm:px-11 max-[374px]:px-7 md:text-lg"
            >
              Submit Sourcing Request
              <Image src={linkArrow} alt="linkArrow" className="w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Different;
