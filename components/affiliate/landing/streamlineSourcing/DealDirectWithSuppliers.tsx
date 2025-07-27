'use client';

import Image from 'next/image';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const DealDirectWithSuppliers = () => {
  const router = useRouter();

  return (
    <div className="flex w-full flex-col rounded-3xl bg-white pl-6 pt-6 text-base leading-6 tracking-normal text-slate-600 shadow-xl transition-transform duration-300 hover:scale-105 max-md:pl-5">
      <div className="text-2xl font-[860] capitalize leading-7 tracking-tight text-slate-900 max-md:max-w-full">
        Deal directly with Suppliers
      </div>
      <div className="mt-3 pr-1 max-md:max-w-full">
        You can visit our shop to buy our supplier contacts documents for
        various products. This way you can deal directly with suppliers in
        China. Your suppliers will ship to our China office and then we ship to
        you.
      </div>
      <div className="mb-5 mt-3 pr-3 max-md:max-w-full">
        We can also help you to verify the products you buy from them.
      </div>
      <Button
        onClick={() => router.push('/auth/signup')}
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

      <div className="mt-2 pl-0 pr-7 lg:mt-8 xl:mt-6 xl:pr-4">
        <Image
          alt="Deal directly with Suppliers Image"
          width={430}
          height={362}
          src={'/home/streamline/deal-directly.svg'}
          className="h-auto w-full"
        />
      </div>
    </div>
  );
};

export default DealDirectWithSuppliers;
