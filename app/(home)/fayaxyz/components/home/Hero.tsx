'use client';

import React from 'react';
import faya from '@/public/assets/img/faya.png';
import heroImg from '@/public/assets/img/hero-img.png';
import Image from 'next/image';
import Button from '../global/Button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      className="overflow-hidden pb-[35px] pt-[90px] sm:pb-[25px] xl:pt-[90px]"
      style={{
        background:
          'linear-gradient(96deg, #161629 0%, #474784 95.54%), #D9D9D9',
      }}
    >
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-y-0 xl:flex-row 2xl:items-start 2xl:gap-10">
          {/* left side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex w-full flex-col items-center justify-center xl:w-fit xl:items-start xl:justify-start 2xl:pt-[53px]"
          >
            <button className="rounded-[32px] bg-[#3E3E57] px-5 py-2.5 text-[16px] leading-[150%] text-white sm:px-[30px] sm:py-3 sm:text-[20px] sm:font-medium sm:leading-[200%]">
              One Year Warranty
            </button>

            <div className="py-6">
              <h1 className="flex items-center justify-center gap-3 whitespace-nowrap pb-2 xl:justify-start">
                <Image
                  src={faya}
                  alt=""
                  className="-mt-[2px] w-[109px] sm:w-[180px]"
                />
                <span className="ml-0 text-[32px] font-semibold leading-none text-white sm:text-[48px] sm:font-bold">
                  60W PD
                </span>
              </h1>

              <h1 className="text-center text-[32px] font-semibold uppercase leading-[44px] text-white sm:whitespace-nowrap sm:text-[48px] sm:font-bold sm:leading-[80px] xl:-mr-20 xl:text-start 2xl:-mr-40">
                Type-C to Type-C
              </h1>

              <p className="text-center text-[20px] font-normal leading-[36px] tracking-[2px] text-white sm:text-[36px] sm:leading-[200%] xl:text-start">
                Fast Charging Cable
              </p>
            </div>
            <Button href="/faya#buy-now">Buy Now</Button>
          </motion.div>

          {/* image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="pt-10 sm:pt-20 xl:pt-0"
          >
            <Image src={heroImg} alt="" />
          </motion.div>

          {/* right side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-full max-w-[478px] flex-1 xl:w-fit 2xl:pt-[53px]"
          >
            <div className="hide-scrollbar flex w-full items-center gap-5 overflow-x-auto sm:flex-col sm:items-start sm:gap-0">
              {['Up to 60W Power', 'Ultra-Fast Charging', 'Built to Last'].map(
                (it, idx) => (
                  <h3
                    key={idx}
                    className={`text-gradient flex w-full items-center gap-2.5 whitespace-nowrap py-4 text-center text-[20px] font-medium leading-[160%] text-white sm:py-6 sm:text-start sm:text-[36px] sm:leading-[150%] lg:py-9 ${
                      idx === 1 ? 'border-white/15 sm:border-y' : ''
                    }`}
                  >
                    <span className="block h-2 w-2 rounded-full bg-white sm:hidden"></span>
                    {it}
                  </h3>
                ),
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
