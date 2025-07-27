'use client';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';

const ReadyToPro = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      <section className="bg-buy-sourcing-lightskyblue p-[90px_0px_90px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[50px_0px]">
        <div className="px-[30px] max-sm:px-[20px]">
          <div className="fix-width">
            <div
              data-aos="fade-up"
              className="mx-auto w-full max-w-[860px] text-center"
            >
              <h4 className="gradient-text text-[42px] font-semibold capitalize leading-tight text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[36px] max-[420px]:text-[26px]">
                Ready to Source Like <br className="block sm:hidden" /> a Pro?
              </h4>
              <p className="text-gray mt-7 text-base font-medium leading-relaxed sm:text-lg md:mt-5">
                Tell us what you need. Let us handle the rest.
              </p>
              <div className="mx-auto mt-8 w-full max-w-[452px] md:mt-12">
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
    </>
  );
};

export default ReadyToPro;
