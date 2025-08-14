'use client';

import React from 'react';
import fayaCable from '@/public/assets/img/faya-cable.png';
import Image from 'next/image';
import Button from '../global/Button';
import { motion } from 'framer-motion';

// type for props
interface SpecialResellerProps {
  handleNavigate: () => void;
}
export default function SpecialReseller({
  handleNavigate,
}: SpecialResellerProps) {
  return (
    <section className="sm:py-15 xl:py-30 bg-[var(--secondary-bg)] py-[50px] xl:pt-[172px]">
      <div className="containerx">
        <div className="relative mx-auto max-w-[1590px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="-top-10 mb-[41px] flex flex-col items-center gap-5 md:gap-[30px] xl:absolute xl:items-start"
          >
            <h3 className="text-center text-[32px] font-semibold leading-[131%] md:text-[42px] md:leading-[152%]">
              <span className="text-gradient-dark w-fit">
                Special Reseller Deal
              </span>
              <span className="!text-[#F58634]">.</span>
            </h3>

            <h5 className="text-[20px] font-medium leading-[150%] text-black md:text-[30px] md:leading-[133.33%]">
              (Up to 40% Off!)
            </h5>

            <Button onClick={handleNavigate}>Buy Now</Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Image src={fayaCable} alt="" className="w-full" />
      </motion.div>

      <div className="containerx lg:!px-0x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient mx-auto mt-[44px] max-w-[280px] rounded-[20px] bg-gradient-to-r from-gray-900 via-blue-950 to-orange-500 px-[25px] py-10 text-center text-[20px] font-medium leading-[150%] text-white shadow-2xl sm:max-w-[480px] sm:text-[32px] md:px-[50px] md:py-10 md:leading-[137.5%] lg:ml-auto lg:mr-0 lg:mt-[80px] lg:w-[70%] lg:max-w-[870px] lg:rounded-r-[0px] lg:text-start"
        >
          Buy 100 units or more and unlock up to 40% off wholesale pricing..
        </motion.div>
      </div>
    </section>
  );
}
