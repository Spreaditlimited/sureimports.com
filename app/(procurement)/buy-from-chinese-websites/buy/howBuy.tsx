'use client';
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
const HowBuy = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="relative bg-buy-sourcing-lightskyblue pb-[208px] pt-[50px] md:pb-60 xl17:pt-44">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div data-aos="fade-up" className="mx-auto w-full max-w-[1110px]">
            <h2 className="gradient-text mb-4 text-center text-[42px] font-semibold capitalize leading-snug text-buy-sourcing-white max-xl:text-[26px] max-sm:px-1 max-sm:text-[36px] max-[375px]:text-[25px]">
              Want to Buy from <br className="block sm:hidden" /> China But
              Don’t Know How?
              <br className="block sm:hidden" />
            </h2>

            <div className="text-center">
              <p className="text-gray mb-[10px] text-base font-medium md:mb-4 md:text-lg">
                Whether it’s 1688, Taobao, Alibaba, Pinduoduo, or any other
                Chinese website — Sure Imports makes it easy.
              </p>
              <p className="text-gray text-base font-medium max-sm:px-4 md:text-lg lg:px-20 xl:px-36">
                We know the language barriers, fake suppliers, and payment
                issues can be a nightmare. That’s why we’ve built a system that
                takes care of everything for you — end to end.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowBuy;
