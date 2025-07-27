'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import butRtoS1 from '@/public/images/butRtoS1.svg';
import butRtoS2 from '@/public/images/butRtoS2.svg';
import butRtoS3 from '@/public/images/butRtoS3.svg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
const features = [
  {
    icon: butRtoS1,
    alt: 'butRtoS1',
    text: 'No hidden fees.',
  },
  {
    icon: butRtoS2,
    alt: 'butRtoS2',
    text: 'No confusion',
  },
  {
    icon: butRtoS3,
    alt: 'butRtoS3',
    text: 'Just stress-free importing.',
  },
];

const ReadyToStart = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="bg-buy-sourcing-lightskyblue pb-[268px] pt-12 md:pb-56 xl:pb-[241px] xl17:pt-[120px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div data-aos="fade-up">
            <div className="mx-auto w-full max-w-[1170px] text-center">
              <h6 className="gradient-text text-[42px] font-semibold capitalize leading-none text-white max-xl:text-[26px] max-sm:text-[36px] max-[360px]:text-[30px]">
                Ready to Start?
              </h6>
              <p className="text-gray mt-4 text-lg font-medium leading-relaxed md:mt-5">
                Just copy the product link and let us handle the rest.
              </p>
              <div className="mt-7 flex items-center justify-between gap-4 max-lg:flex-col lg:mt-12 lg:flex-row lg:justify-center lg:gap-[30px]">
                {features.map((item, index) => (
                  <div
                    key={index}
                    className={`customboxshadow flex w-full items-center justify-center gap-4 rounded-2xl bg-buy-sourcing-white px-5 py-6 shadow-md md:gap-5 md:rounded-[20px] md:px-7 md:py-8 xl:gap-[30px] xl:px-9`}
                  >
                    <Image src={item.icon} alt={item.alt} className="size-8" />
                    <span className="gradient-text text-xl font-semibold xl:text-2xl">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-8 w-full max-w-[276px] md:mt-12 md:max-w-[383px]">
              <Link
                href={'/auth/signup-procurement'}
                className="hover:bg-blue/70 w-full rounded-[50px] bg-buy-sourcing-blue px-4 py-3 text-base font-medium text-white transition-all duration-300 md:px-8 md:text-lg"
              >
                Create Your Free Account Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToStart;
