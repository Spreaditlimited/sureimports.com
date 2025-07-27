'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import payicon from '@/public/images/payicon.svg';
import paysmall from '@/public/images/paysmall.svg';
import Bluebtn from './bluebtn';
import Whitebtn from './whitebtn';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Pay: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const payListItems: string[] = [
    'Buy any device outright',
    'Fastest processing and delivery - 10 business days from China to Lagos.',
    'Ideal for customers ready to complete payment upfront',
  ];

  const paySmallListItems: string[] = [
    'Start with just ₦5,000',
    'No fixed amount afterwards — pay what you can',
    'No fixed dates — pay anytime',
    'No card required — we give you a virtual account',
    'Once paid in full within 6 months, we ship from China to Lagos.',
  ];

  return (
    <div className="p-[60px_0px_120px] max-xl17:p-[20px_0px_60px] max-xl:p-[10px_0px_40px] max-lg:p-[10px_0px_30px] max-sm:p-[25px_0px_50px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="grid grid-cols-12 gap-[5px] max-xl17:gap-[20px] max-lg:gap-[30px_10px]">
            {/* Column 1: Heading and Paragraph */}
            <div className="col-span-4 max-lg:col-span-12">
              <div
                className="flex h-full flex-col justify-center max-lg:text-center"
                data-aos="fade-up"
              >
                <h2 className="gradient-text inline-block text-[42px] font-semibold leading-normal max-xl:text-[36px] max-[420px]:text-[30px]">
                  Two Ways To Pay
                </h2>
                <p className="text-gray mt-[20px] max-w-[511px] text-[18px] font-medium leading-[166%] max-xl:text-[16px] max-lg:mx-auto max-sm:mt-[15px] max-sm:text-black">
                  Buy outright for fast delivery or take your time with our
                  flexible “Pay Small Small” option. No pressure, no hidden fees
                  — just the easiest way to get phones and laptops from China.
                  Your payment, your pace.
                </p>
              </div>
            </div>

            {/* Column 2: Pay in Full */}
            <div className="col-span-4 max-lg:col-span-12">
              <div
                className="ml-auto flex h-full w-full max-w-[499px] flex-col justify-between rounded-[30px] border border-solid border-[#F4F4F4] bg-white p-[40px_40px_35px] shadow-cardshadow max-xl:p-[30px_25px] max-lg:mx-auto"
                data-aos="fade-up"
              >
                <div>
                  <div className="bg-lightskyblue inline-flex items-center justify-center rounded-[29px] p-[12px_30px]">
                    <Image src={payicon} alt="icon" />
                    <span className="text-blue pl-[20px] text-[18px] font-medium leading-[155%] max-[420px]:text-[15px]">
                      Pay in Full
                    </span>
                  </div>
                  <div className="pay-list mt-[45px] max-sm:mt-[30px]">
                    <ul className="flex flex-col gap-[20px]">
                      {payListItems.map((item, index) => (
                        <li
                          key={index}
                          className="text-gray pl-[40px] text-[16px] font-normal leading-[150%] max-sm:text-black"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-[50px] max-sm:mt-[30px]">
                  <Bluebtn
                    text="Pay in Full – Fastest Delivery"
                    className="w-full max-xl14:p-[12px_30px] max-xl14:text-[18px] max-xl:p-[12px_14px] max-xl:text-[16px] max-sm:p-[12px_14px!important] max-[420px]:text-[14px]"
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Pay Small Small */}
            <div className="col-span-4 max-lg:col-span-12">
              <div
                className="bg-blue ml-auto flex h-full w-full max-w-[499px] flex-col justify-between rounded-[30px] border border-solid border-[#F4F4F4] p-[40px_40px_35px] shadow-cardshadow2 max-xl:p-[30px_25px] max-lg:mx-auto"
                data-aos="fade-up"
              >
                <div className="bluebgcard">
                  <div className="inline-flex items-center justify-center rounded-[29px] bg-[#F0F5FF] p-[12px_30px]">
                    <Image src={paysmall} alt="icon" />
                    <span className="text-blue pl-[20px] text-[18px] font-medium leading-[155%] max-[420px]:text-[15px]">
                      Pay Small Small
                    </span>
                  </div>
                  <div className="pay-list mt-[45px] max-sm:mt-[30px]">
                    <ul className="flex flex-col gap-[20px]">
                      {paySmallListItems.map((item, index) => (
                        <li
                          key={index}
                          className="pl-[40px] text-[16px] font-normal leading-[150%] text-white"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-[50px] max-sm:mt-[30px]">
                  <Whitebtn
                    text="Start with ₦5,000"
                    className="text-blue w-full max-xl:p-[12px_18px] max-xl:text-[16px] max-[420px]:text-[14px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
