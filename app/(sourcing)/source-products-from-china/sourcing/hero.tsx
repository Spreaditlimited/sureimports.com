'use client';
import React, { useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';
import AOS from 'aos';
import 'aos/dist/aos.css';
import linkArrow from '@/public/images/linkArrow.svg';
import PublicHeroBackground from '@/components/home/PublicHeroBackground';

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-950 p-[70px_0_70px] md:p-[105px_0_85px] xl15:p-[145px_0_188px]">
      <PublicHeroBackground />
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
            <h1 className="text-5xl font-black capitalize leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl">
              Get Exactly What You Want from China{' '}
              <span className="hidden sm:block">Without Lifting a Finger</span>
            </h1>
            <p className="mt-4 px-5 text-base font-normal leading-relaxed text-slate-300 md:px-28 md:text-lg lg:px-14 xl:px-20 xl14:px-32">
              We’ve Helped Hundreds of Businesses Source Machines, Equipment &
              Custom Products Since 2018. Now Let’s Do It for You.
            </p>
            <Link
              href={'/auth/signup-sourcing'}
              className="mx-auto mt-5 flex w-fit items-center justify-center gap-[10px] rounded-[30px] bg-buy-sourcing-blue p-[10px_30px] text-base font-bold leading-[155%] text-white transition-all hover:bg-indigo-700 md:mt-[30px]"
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

export default Hero;
