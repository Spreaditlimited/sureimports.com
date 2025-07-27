'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const CostCalculator = () => {
  const router = useRouter();
  return (
    <div className="flex w-full rounded-3xl bg-white px-6 pt-6 shadow-xl transition-transform duration-300 hover:scale-105">
      <div className="flex flex-col">
        <div className="text-2xl font-[860] capitalize">
          Use our Landing Cost Calculator
        </div>
        <div className="mr-0 mt-6 leading-6 text-slate-600 xl:mr-36">
          If you are new to importing from China, our landing cost calculator
          will serve you well. Our landing cost calculator takes into
          consideration every possible cost involved with purchasing and
          shipping your products from China to Nigeria and many other countries.
        </div>

        <div className="mb-5">
          <Button
            onClick={() =>
              router.push('https://spreaditglobal.com/calculator/')
            }
            className="mt-8 flex h-12 w-[158px] items-center gap-2 rounded-[72px] bg-indigo-800 text-white md:mb-0"
          >
            Get Started
            <Image
              src={'/icons/arrowForGetStart.png'}
              width={14}
              height={14}
              alt="arrow"
            />
          </Button>
        </div>
        <div className="flex w-full justify-center md:hidden">
          <div className="relative mb-2 mt-2 w-[150px]">
            <Image
              src={'/home/streamline/calculator.png'}
              alt={'paySupplier'}
              width={300}
              height={309}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
      <div className="hidden w-full justify-center md:flex">
        <div className="relative mt-5 md:mt-16 md:w-[180px] lg:mt-5 lg:w-[180px] xl:w-[150px] 2xl:w-[220px]">
          <Image
            src={'/home/streamline/calculator.png'}
            alt={'paySupplier'}
            width={300}
            height={309}
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;
