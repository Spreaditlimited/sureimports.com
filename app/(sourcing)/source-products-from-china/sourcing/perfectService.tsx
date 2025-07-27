'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import service1 from '@/public/images/service1.svg';
import service2 from '@/public/images/service2.svg';
import service3 from '@/public/images/service3.svg';
import service4 from '@/public/images/service4.svg';
import service5 from '@/public/images/service5.svg';

const PerfectService = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const servicesOne = [
    {
      icon: service1,
      text: 'Entrepreneurs launching custom products',
    },
    {
      icon: service2,
      text: 'Small business owners who want to white-label',
    },
    {
      icon: service3,
      text: 'Procurement teams looking for specific machinery or supplies',
    },
  ];

  const servicesTwo = [
    {
      icon: service4,
      text: 'Organizations with bulk/custom orders',
    },
    {
      icon: service5,
      text: 'Anyone who wants to buy from China without stress',
    },
  ];

  return (
    <section className="p-[60px_0px_120px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[25px_0px_50px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="guarentee-bg s14:py-[90px] rounded-[40px] px-5 py-[50px] md:py-10 xl:py-14">
            <h4
              data-aos="fade-up"
              className="text-center text-[42px] font-semibold capitalize leading-tight text-white max-xl:text-[26px] max-sm:text-[36px] max-[360px]:text-[28px]"
            >
              This Service Is <br className="block sm:hidden" /> Perfect For
            </h4>
            <div className="s14:max-w-6xl s15:max-w-[1206px] s14:gap-[30px] mx-auto mt-7 flex w-full flex-col gap-[15px] md:gap-5 lg:max-w-[800px] xl:mt-12 xl:max-w-[1070px]">
              <div
                data-aos="fade-up"
                className="s14:gap-[30px] flex gap-[15px] max-lg:flex-col md:gap-5 lg:flex-wrap"
              >
                {servicesOne.map((service, index) => (
                  <div
                    key={index}
                    className="s14:p-7 s14:gap-6 flex flex-1 items-center gap-5 rounded-2xl bg-white/20 p-5 backdrop-blur-lg"
                  >
                    <Image
                      src={service.icon}
                      alt="icon"
                      className="size-9 max-[389px]:size-7"
                    />
                    <p className="text-base font-medium text-buy-sourcing-white max-[389px]:text-sm xl:text-lg">
                      {service.text}
                    </p>
                  </div>
                ))}

                <div className="s15:max-w-[794px] mx-auto w-full lg:max-w-[530px] xl:max-w-[760px]">
                  <div className="s14:gap-[30px] flex gap-[15px] max-lg:flex-col md:gap-5 lg:flex-wrap">
                    {servicesTwo.map((service, index) => (
                      <div
                        key={index}
                        className="s14:p-7 s14:gap-6 flex flex-1 items-center gap-5 rounded-2xl bg-white/20 p-5 backdrop-blur-lg"
                      >
                        <Image
                          src={service.icon}
                          alt="icon"
                          className="size-9 max-[389px]:size-7"
                        />
                        <p className="text-base font-medium text-buy-sourcing-white max-[389px]:text-sm xl:text-lg">
                          {service.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerfectService;
