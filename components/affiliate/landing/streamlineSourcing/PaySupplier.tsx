'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const PaySupplier = () => {
  const router = useRouter();
  return (
    <div className="flex rounded-3xl bg-white pl-6 pt-6 shadow-xl transition-transform duration-300 hover:scale-105">
      <div className="flex flex-col">
        <div className="text-2xl font-[860] capitalize">Pay Supplier</div>
        <div className="mr-0 mt-3 leading-6 text-slate-600 xl:mr-1">
          We help thousands of people across the world to safely pay their
          suppliers in China. Worried about dealing with legit suppliers and the
          safety of your funds? We will assist by verifying and paying your
          suppliers on your behalf. Your suppliers will be credited within one
          business day. Note that we can pay suppliers in Chinese Yuan only.
        </div>

        <div className="mb-5 md:mb-2 lg:mb-5 xl:mb-4 2xl:mb-3">
          <Button
            onClick={() => router.push('/auth/signup')}
            className="mb:mt-4 mt-8 flex h-12 w-[158px] items-center gap-2 rounded-[72px] bg-indigo-800 text-white md:mb-0 lg:mt-6 xl:mt-8 2xl:mt-7"
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
        <div className="mt-2 flex w-full justify-end md:hidden">
          <div className="align-end relative w-[260px] justify-end md:mt-10 md:w-[200px] lg:w-[300px] xl:w-[250px] 2xl:w-[230px]">
            <Image
              src={'/home/streamline/pay-supplier.svg'}
              alt={'paySupplier'}
              width={337}
              height={309}
              className="h-auto w-full rounded-e-2xl"
            />
          </div>
        </div>
      </div>
      <div className="hidden h-full w-full justify-end md:flex">
        <div className="ml-0 mt-0 md:mt-56 md:w-[200px] lg:mt-24 lg:w-[285px] xl:mt-0 xl:w-[320px] 2xl:mt-10 2xl:w-[343px]">
          <Image
            src={'/home/streamline/pay-supplier.svg'}
            alt={'paySupplier'}
            width={371}
            height={309}
            className="h-auto w-full rounded-r-2xl"
          />
        </div>
      </div>
      {/* <div className="flex justify-end align-bottom max-md:justify-center">
        <div className={`relative max-2xl:w-[420px] max-lg:w-[300px]`}>
          <Image
            loading="lazy"
            src={'/images/paySupplierImg.png'}
            alt={'paySupplier'}
            layout="responsive"
            width={337}
            height={309}
            className="h-auto w-full"
          />
        </div>
      </div> */}
    </div>
  );
};

export default PaySupplier;
