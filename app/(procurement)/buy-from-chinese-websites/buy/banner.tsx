'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import buybannerbg from '@/public/images/buybannerbg.png';
import contactBannerBg from '@/public/images/contactBannerBg.png';
import linkArrow from '@/public/images/linkArrow.svg';
const Banner = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="relative pb-[120px] pt-[80px] md:pb-40 md:pt-56 xl14:pb-48 xl14:pt-[140px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div
            data-aos="fade-up"
            className="relative z-[5] w-full max-sm:text-center sm:max-w-[400px] xl:max-w-[620px] xl14:max-w-[695px]"
          >
            <div className="mx-auto mb-6 inline-block rounded-[10px] bg-white/20 p-[8px_15px] xl:p-[10px_30px]">
              <p className="text-base font-medium text-white max-[420px]:text-xs xl:text-lg">
                Spreaditglobal.com is now{' '}
                <Link
                  href="https://www.sureimports.com/"
                  target="_blank"
                  className="transition-all duration-300 hover:text-white/70"
                >
                  Sureimports.com
                </Link>
              </p>
            </div>
            <h1 className="text-[42px] font-semibold capitalize leading-tight text-white max-xl:text-[26px] max-sm:text-[34px] max-[375px]:text-[28px]">
              Buy From Chinese <br className="block sm:hidden" /> Websites The
              Smart, <br className="block sm:hidden" /> Stress-Free Way
            </h1>
            <p className="mt-4 text-base font-normal leading-relaxed text-white max-sm:px-5 md:text-lg xl17:pr-6">
              Since 2018, Sure Imports has helped thousands of people buy
              directly from Chinese websites — safely and affordably. Now it’s
              your turn.
            </p>
            <Link
              href={'/auth/signup-procurement'}
              className="mt-5 flex w-fit items-center gap-[10px] rounded-[30px] bg-buy-sourcing-blue p-[10px_30px] text-base font-medium leading-[155%] text-buy-sourcing-white transition-all hover:bg-indigo-700 max-sm:mx-auto max-sm:w-full max-sm:justify-center md:mt-[30px] md:text-lg"
            >
              Submit Your Links{' '}
              <Image src={linkArrow} alt="linkArrow" className="w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="from-0 absolute inset-0 z-[-1] bg-gradient-to-tr from-[#161629] to-[#474784] to-95%">
        <Image
          src={contactBannerBg}
          alt="image"
          className="hidden h-full w-full object-cover md:block"
        />
        <Image
          src={buybannerbg}
          alt="image"
          className="block h-full w-full md:hidden"
        />
      </div>
    </section>
  );
};

export default Banner;
