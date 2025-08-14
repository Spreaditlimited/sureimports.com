'use client';

import React from 'react';
import pay from '@/public/assets/img/pay.svg';
import verfied from '@/public/assets/img/verified-checked.svg';
import Image from 'next/image';
import Button from '../global/Button';
import { motion } from 'framer-motion';

export default function ReadyToGet() {
  const data = [
    {
      title: 'Three Payment Options',
      icon: pay,
    },
    {
      title: '1-Year Warranty Guaranteed',
      icon: verfied,
    },
  ];

  // Variants for cards fade + slide up
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className="sm:py-15 xl:py-30 bg-[var(--secondary-bg)] py-[50px]">
      <div className="containerx">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-gradient-dark mx-auto w-fit text-center text-[32px] font-semibold leading-[131%] lg:text-[42px] lg:leading-[152%]"
        >
          Ready to Get Yours?
        </motion.h2>

        <div className="mx-auto mb-5 mt-[30px] max-w-[1150px] lg:mb-[50px] lg:mt-[50px]">
          <div className="grid w-full grid-cols-1 flex-wrap gap-[30px] gap-y-[15px] sm:grid-cols-2 xl:gap-[50px]">
            {data.map((it, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                className="flex flex-1 items-center gap-5 rounded-[10px] border border-[#F4F4F4] bg-white px-[30px] py-5 sm:flex-none sm:rounded-[20px] xl:gap-[30px] xl:px-[50px] xl:py-10"
                style={{
                  boxShadow: '10px 10px 10px 0px rgba(0, 0, 0, 0.08) ',
                }}
              >
                <Image src={it.icon} alt="" className="w-[32px] xl:w-[42px]" />

                <h3 className="text-gradient-dark w-fit text-[18px] font-semibold leading-[144.44%] lg:text-[24px] lg:leading-[200%]">
                  {it.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          className="text-center text-[16px] leading-[150%] text-black lg:text-[24px]"
        >
          Click below to place your order now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          className="mx-auto mt-[30px] w-fit"
        >
          <Button href="/faya#buy-now">Buy Now</Button>
        </motion.div>
      </div>
    </section>
  );
}
