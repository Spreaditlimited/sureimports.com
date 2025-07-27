'use client';
import React, { useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import heroBg from '@/public/images/heroBg-lines.png';
import heroBgM from '@/public/images/heroBgMobile.png';
import linkArrow from '@/public/images/linkArrow.svg';

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="relative p-[70px_0_70px] md:p-[105px_0_85px] xl15:p-[145px_0_188px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div
            data-aos="fade-up"
            className="relative z-[5] mx-auto w-full text-center lg:max-w-[590px] xl:max-w-[940px] xl14:max-w-[940px]"
          >
            <div className="mx-auto mb-6 inline-block rounded-[10px] bg-white/20 p-[8px_20px] md:p-[10px_30px]">
              <p className="text-base font-medium text-buy-sourcing-white max-[429px]:text-xs lg:text-lg">
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
            {/* <h1 className="text-center text-[42px] font-semibold capitalize leading-tight text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[34px] max-[420px]:text-[26px]"> */}
            <h1 className="text-[42px] font-semibold capitalize leading-tight text-white max-xl:text-[26px] max-sm:text-[34px] max-[375px]:text-[28px]">
              Get Exactly What You Want from China{' '}
              <span className="hidden sm:block">Without Lifting a Finger</span>
            </h1>
            <p className="mt-4 px-5 text-base font-normal leading-relaxed text-white md:px-28 md:text-lg lg:px-14 xl:px-20 xl14:px-32">
              We’ve Helped Hundreds of Businesses Source Machines, Equipment &
              Custom Products Since 2018. Now Let’s Do It for You.
            </p>
            <Link
              href={'/auth/signup-sourcing'}
              className="mx-auto mt-5 flex w-fit items-center justify-center gap-[10px] rounded-[30px] bg-buy-sourcing-blue p-[10px_30px] text-base font-medium leading-[155%] text-buy-sourcing-white transition-all hover:bg-indigo-700 md:mt-[30px] md:text-lg"
            >
              Submit Sourcing Request
              <Image src={linkArrow} alt="linkArrow" className="w-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="from-0 absolute inset-0 z-[-1] bg-gradient-to-tr from-[#161629] to-[#474784] to-95%">
        <Image
          src={heroBg}
          alt="image"
          className="hidden h-full w-full object-cover md:block"
        />
        <Image
          src={heroBgM}
          alt="image"
          className="block h-full w-full md:hidden"
        />
      </div>
    </section>
  );
};

export default Hero;
