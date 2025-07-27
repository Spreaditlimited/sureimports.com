'use client';
import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import buySureI1 from '@/public/images/buySureI1.svg';
import buySureI2 from '@/public/images/buySureI2.svg';
import buySureI3 from '@/public/images/buySureI3.svg';
import buySureI4 from '@/public/images/buySureI4.svg';
import buySureI5 from '@/public/images/buySureI5.svg';
import buySureI6 from '@/public/images/buySureI6.svg';
import buySureImg1 from '@/public/images/buySureImg1.jpg';
import buySureImg2 from '@/public/images/buySureImg2.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Type for items with icons and text
type InfoItem = {
  icon: StaticImageData;
  text: string;
  title: string;
};

const Whysureimports: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const items: InfoItem[] = [
    {
      icon: buySureI1,
      title: 'No Language Barrier:',
      text: 'We speak directly with Chinese sellers — in Chinese.',
    },
    {
      icon: buySureI2,
      title: 'Verified Suppliers Only:',
      text: 'We help you avoid scams and fake listings.',
    },
    {
      icon: buySureI3,
      title: 'Flexible Payment Options:',
      text: 'Pay in Naira or USD — whatever works for you.',
    },
    {
      icon: buySureI4,
      title: 'Worldwide Delivery:',
      text: 'We ship to Nigeria, the UK, the US, Canada, and beyond.',
    },
    {
      icon: buySureI5,
      title: 'Quality Control:',
      text: 'We inspect every item before it leaves China.',
    },
    {
      icon: buySureI6,
      title: 'Since 2018:',
      text: 'We’re trusted by thousands of businesses and individuals.',
    },
  ];

  const videoItems = [
    {
      poster: buySureImg1,
      caption:
        'A satisfied customer who bought one of our pre-owned iPhones in April 2024.',
    },
    {
      poster: buySureImg2,
      caption:
        'Another satisfied customer who has bought two pre-owned iPhones from us so far.',
    },
  ];

  return (
    <div className="overflow-hidden p-[120px_0px_60px] max-xl17:p-[50px_0px_25px] max-xl:p-[40px_0px_25px] max-lg:p-[20px_0px_10px] max-sm:p-[50px_0px_25px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div
            data-aos="fade-up"
            className="grid grid-cols-12 max-xl17:gap-[30px] max-[420px]:gap-[30px_0px]"
          >
            <div className="col-span-12 xl:col-span-6">
              <div
                className="w-full max-lg:max-w-full xl:max-w-[724px]"
                data-aos="fade-up"
              >
                <div className="max-lg:text-center">
                  <h2 className="gradient-text text-[42px] font-semibold capitalize leading-tight text-white max-xl:text-[26px] max-sm:text-[36px] max-[360px]:text-[30px]">
                    Why Use <br className="block sm:hidden" /> Sure Imports?
                  </h2>
                </div>
                <div className="mt-[50px] max-sm:mt-[43px]">
                  <ul className="flex flex-col gap-[20px_0px] max-sm:gap-[20px_0px]">
                    {items.map((item, index) => (
                      <li
                        key={index}
                        className="border-b-solid flex min-h-[76px] items-center gap-[20px] border-b-[1px] border-b-[#CBCBCB] pb-[20px] pr-0 sm:pr-[74px] md:gap-[30px]"
                      >
                        <Image
                          src={item.icon}
                          alt="icon"
                          className="w-6 max-md:mb-auto md:w-9"
                        />
                        <div className="max-sm:pr-7">
                          <span className="mb-[10px] block text-lg font-semibold leading-[140%] text-[#161629] md:mb-3 md:text-xl">
                            {item.title}
                          </span>
                          <p className="text-darkblack text-[16px] font-medium leading-[155%]">
                            {item.text}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-span-12 max-md:hidden xl:col-span-6">
              <div
                className="video-part-block gap-8 sm:grid sm:grid-cols-12"
                data-aos="fade-up"
              >
                {videoItems.map((item, index) => (
                  <div
                    key={index}
                    className="first:mt-52 max-xl:first:mt-[0px] max-sm:mb-8 max-sm:last:mb-0 sm:col-span-6"
                  >
                    <div className="video-wrp-block">
                      <div className="relative h-[513px] overflow-hidden rounded-[20px] max-xl14:h-[450px] max-xl:h-[370px] max-sm:h-[513px] max-[420px]:h-[400px]">
                        <Image
                          src={item.poster}
                          alt="Customer Image"
                          fill
                          className="rounded-[20px] object-cover"
                          style={{ zIndex: 1 }}
                        />
                      </div>

                      {/* caption */}
                      {/* <div className="max-sm:mt-[25px] max-sm:pr-[0px] max-sm:text-center mt-[15px] pr-[40px]">
                        <p className="max-sm:text-[18px] max-xl:text-[16px] text-darkblack text-[20px] font-medium leading-[160%]">
                          {item.caption}
                        </p>
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whysureimports;
