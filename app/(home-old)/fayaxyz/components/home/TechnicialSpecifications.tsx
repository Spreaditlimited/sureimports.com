'use client';

import React from 'react';
import Button from '../global/Button';
import cable from '@/public/assets/img/faya_cable.svg';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TechnicialSpecifications() {
  const data = [
    {
      question: 'Cable Type',
      answer: 'Type-C to Type-C',
    },
    {
      question: 'Build Tech',
      answer: '5 Chips, 5 Wire Cores, 5 Contact Points',
    },
    {
      question: 'Power Delivery (PD)',
      answer: 'Yes (60W PD Compatible)',
    },
    {
      question: 'Warranty',
      answer: '1 Year',
    },
    {
      question: 'Charging Speed',
      answer: '0-75% in 30 mins, smart taper thereafter',
    },
    {
      question: 'Brand',
      answer: 'FAYA - A Trademark of Sure Importers Ltd',
    },
    {
      question: 'Max Output',
      answer: '60W (20V/3A)',
    },
    {
      question: 'Payment Option',
      answer: 'Multiple Payment Options',
    },
    {
      question: 'Cable Length',
      answer: '2 meters (6ft)',
    },
  ];

  return (
    <section className="sm:pt-15 xl:pt-30 bg-[#F1F5F9] pt-[50px]">
      <div className="container">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-gradient-dark mx-auto mb-[30px] w-fit text-center text-[32px] font-semibold leading-[131%] md:text-[36px] md:leading-[152%] xl:hidden"
        >
          Technical Specifications
        </motion.h3>

        <div className="flex flex-col-reverse items-start gap-[100px] gap-y-[30px] xl:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex w-full flex-col items-center gap-5 lg:gap-[30px] xl:w-fit xl:items-start"
          >
            <h3 className="text-gradient-dark hidden w-fit text-center text-[32px] font-semibold leading-[131%] md:text-[36px] md:leading-[152%] xl:block">
              Technical Specifications
            </h3>

            <Button href="/faya#buy-now">Buy Now</Button>

            <div className="flex justify-center xl:w-[165px]">
              <Image
                src={cable}
                alt=""
                className="w-[76px] sm:w-[100px] xl:w-[139px]"
              />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
            viewport={{ once: true }}
            className="grid w-full flex-1 grid-cols-2 gap-[30px] sm:gap-[33px] xl:w-fit"
          >
            {data.map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-2 xl:gap-[5px]"
              >
                <h4 className="text-[18px] font-medium leading-[150%] text-[var(--dark-color)] xl:leading-[188%]">
                  {item.question}
                </h4>
                <p className="text-[16px] font-normal leading-[150%] text-[#475569] xl:leading-[212.5%]">
                  {item.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
