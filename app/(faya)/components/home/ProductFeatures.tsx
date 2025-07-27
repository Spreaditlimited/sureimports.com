'use client';

import React from 'react';
import faya from '@/public/assets/img/faya-dark.png';
import Image from 'next/image';
import Button from '../global/Button';
import batteryCharging from '@/public/assets/img/features/battery-charging.svg';
import box from '@/public/assets/img/features/box.svg';
import cpuCharge from '@/public/assets/img/features/cpu-charge.svg';
import elevtricity from '@/public/assets/img/features/electricity.svg';
import flash from '@/public/assets/img/features/flash.svg';
import hastag from '@/public/assets/img/features/hashtag.svg';
import medalStar from '@/public/assets/img/features/medal-star.svg';
import universal from '@/public/assets/img/features/universal.svg';
import weight from '@/public/assets/img/features/weight.svg';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GoArrowUpRight } from 'react-icons/go';
interface SpecialResellerProps {
  handleNavigate: () => void;
}
export default function ProductFeatures({
  handleNavigate,
}: SpecialResellerProps) {
  const features = [
    {
      title: '60W PD Ready',
      description:
        'Works with all Power Delivery chargers for lightning-fast results.',
      icon: flash,
    },
    {
      title: 'Smart Charge Sequence',
      description:
        'From 0-75% in just 30 mins when your battery is low, then auto-switches to safe standard charge.',
      icon: batteryCharging,
    },
    {
      title: 'Universal Type-C to Type-C',
      description:
        'Works with most modern Android phones, tablets, iPads, power banks, and USB-C laptops.',
      icon: universal,
    },
    {
      title: 'Reinforced Tech Build',
      description:
        '5-core wiring, 5 chips, and 5-point contacts for long-term performance.',
      icon: cpuCharge,
    },
    {
      title: '2m Length',
      description: 'The perfect balance of mobility and reach (6ft).',
      icon: elevtricity,
    },
    {
      title: '60W Capacity',
      description:
        'Power your phones, tablets, accessories and more - efficiently.',
      icon: weight,
    },
    {
      title: 'Backed by a 1-Year Warranty',
      description: "We don't just talk quality - we guarantee it.",
      icon: medalStar,
    },
    {
      titleIcon: faya,
      description: 'FAYA is a Registered Trademark of Sure Importers Limited',
      icon: hastag,
    },

    {
      title: 'Multiple Payment Options Available',
      description: 'For your convenience',
      icon: box,
    },
  ];

  return (
    <section className="sm:py-15 xl:py-30 bg-white py-[50px]">
      <div className="container">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-[1415px] text-center text-[16px] font-medium leading-[200%] text-[var(--dark-color)] sm:text-[20px] xl:text-[24px]"
        >
          Whether you're powering your own device or running a tech retail
          business, the
          <Image
            src={faya}
            alt=""
            className="mb-1 ml-1 inline h-[19px] w-[56px] sm:w-[70px] xl:mb-2 xl:ml-2 xl:h-[24px]"
          />{' '}
          Type-C to Type-C cable delivers speed, durability, and serious value.
          Engineered for fast, safe charging, it's compatible with PD (Power
          Delivery) chargers and built to handle up to 60W of power. And yes,
          it's got brains and brawn - with 5 contacts, 5 chips, and 5 wire cores
          packed into a sleek 2m design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="buy-now-reseller mt-[30px] flex items-center justify-center gap-5 md:gap-[30px]"
        >
          <Button
            href="/faya#buy-now"
            className="whitespace-nowrap !px-5 sm:!px-[30px]"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            className="whitespace-nowrap !px-5 sm:!px-[30px]"
            onClick={handleNavigate}
          >
            Become a Reseller
          </Button>
        </motion.div>

        <div className="mx-auto mt-[50px] grid max-w-[1590px] grid-cols-1 gap-[15px] md:grid-cols-2 lg:mt-[110px] lg:gap-[30px] xl:grid-cols-3">
          {features.map((ft, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="rounded-[20px] border border-[#F4F4F4] bg-white p-5 sm:p-[30px]"
              style={{
                boxShadow: '10px 10px 10px 0px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="mb-[18px] flex items-center gap-[15px]">
                <Image
                  src={ft.icon}
                  className="aspect-square w-[34px] sm:w-[40px]"
                  alt=""
                />

                {ft.titleIcon && (
                  <Image
                    src={ft.titleIcon}
                    alt=""
                    className="w-[54px] sm:w-[70px]"
                  />
                )}

                <h4 className="text-[18px] font-semibold leading-[150%] text-[var(--dark-color)] sm:text-[20px]">
                  {ft.title}
                </h4>
              </div>
              <p className="min-h-[48px] text-[16px] font-normal leading-[150%] text-[var(--secondary-color)]">
                {ft.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
