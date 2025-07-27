'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import search from '@/public/images/search.svg';
import guarantee from '@/public/images/guarantee.svg';
import truck from '@/public/images/truck.svg';
import Link from 'next/link';
const cards = [
  {
    icon: search,
    alt: 'Discover',
    title: 'We’ll find it.',
    orderID: 1,
  },
  {
    icon: guarantee,
    alt: 'Protect',
    title: 'Guarantee it.',
    orderID: 3,
  },
  {
    icon: truck,
    alt: 'Deliver',
    title: 'Ship it.',
    orderID: 2,
  },
];

const TakeFirstStep = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="bg-buy-sourcing-lightskyblue py-12 md:py-[120px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div data-aos="fade-up">
            <div className="mx-auto w-full max-w-[909px] text-center">
              <h6 className="gradient-text text-[42px] font-semibold capitalize leading-none text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[34px] max-[360px]:text-[30px]">
                Take the First Step
              </h6>
              <p className="text-gray mt-7 text-lg font-medium leading-relaxed max-md:hidden md:mt-5">
                Thousands trust Sure Imports to handle their sourcing from
                China. You should too.
              </p>

              <div className="mt-12 flex items-center justify-between gap-4 max-md:flex-wrap md:flex-row md:justify-center md:gap-[30px]">
                <div
                  className={`customboxshadow flex w-[47.3%] items-center justify-center gap-4 rounded-2xl bg-buy-sourcing-white px-5 py-6 shadow-md max-md:order-1 max-[429px]:px-2 max-[420px]:w-[46.5%] max-[420px]:gap-3 md:w-full md:gap-5 md:rounded-[20px] md:px-7 md:py-8 xl:gap-[30px] xl:px-9`}
                >
                  <Image
                    src={search}
                    alt="Discover"
                    className="size-6 max-[429px]:size-5 md:size-8"
                  />
                  <span className="gradient-text text-lg font-semibold max-[389px]:text-[14px] md:text-xl xl:text-2xl">
                    We’ll find it.
                  </span>
                </div>
                <div
                  className={`customboxshadow flex w-[100%] items-center justify-center gap-4 rounded-2xl bg-buy-sourcing-white px-5 py-6 shadow-md max-md:order-3 max-[429px]:gap-3 max-[429px]:px-2 md:w-full md:gap-5 md:rounded-[20px] md:px-7 md:py-8 xl:gap-[30px] xl:px-8`}
                >
                  <Image
                    src={guarantee}
                    alt="Protect"
                    className="size-6 max-[429px]:size-5 md:size-8"
                  />
                  <span className="gradient-text text-lg font-semibold max-[389px]:text-[14px] md:text-xl xl:text-2xl">
                    Guarantee it.
                  </span>
                </div>
                <div
                  className={`customboxshadow flex w-[47.3%] items-center justify-center gap-4 rounded-2xl bg-buy-sourcing-white px-5 py-6 shadow-md max-md:order-2 max-[429px]:px-2 max-[420px]:w-[46.5%] max-[420px]:gap-3 md:w-full md:gap-5 md:rounded-[20px] md:px-7 md:py-8 xl:gap-[30px] xl:px-9`}
                >
                  <Image
                    src={truck}
                    alt="Deliver"
                    className="size-6 max-[429px]:size-5 md:size-8"
                  />
                  <span className="gradient-text text-lg font-semibold max-[389px]:text-[14px] md:text-xl xl:text-2xl">
                    Ship it.
                  </span>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-8 w-full max-w-[473px] md:mt-12">
              <Link
                href={'/auth/signup-sourcing'}
                className="hover:bg-blue/70 w-full rounded-[50px] bg-buy-sourcing-blue px-5 py-3 text-base font-medium text-buy-sourcing-white transition-all duration-300 max-[389px]:text-sm sm:px-8 sm:text-lg"
              >
                Submit Your Sourcing Request Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TakeFirstStep;
