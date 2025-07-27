'use client';

import Image from 'next/image';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const BuyPhones = () => {
  const router = useRouter();
  return (
    <div className="flex rounded-3xl bg-white pl-6 pt-5 shadow-xl transition-transform duration-300 hover:scale-105">
      <div className="w-full">
        <div className="flex flex-col">
          <div className="text-2xl font-[860] capitalize">
            Buy Phones From China
          </div>
          <div className="mt-3 leading-6 text-slate-600">
            We ship the best brand new and used phones from china.Phones are
            deliverd within 10 business days after payment
          </div>
          <Button
            onClick={() => router.push('/shop/buy-phones-from-china')}
            className="mb-5 mt-5 flex h-12 w-[157px] items-center gap-2 rounded-[72px] bg-indigo-800 font-[590px] text-white md:mb-5 lg:mb-5"
          >
            Get Started
            <Image
              src={'/icons/arrowForGetStart.png'}
              width={14}
              height={14}
              alt="arrow"
            />
          </Button>

          <div className="ml-0 2xl:ml-20 2xl:w-[450px]">
            <Image
              src={'/images/buyChainesPhone.png'}
              width={300}
              height={150}
              alt="china phone"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyPhones;
