'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

const SpecialProductSourcing = () => {
  const router = useRouter();
  return (
    <div className="ml-0 rounded-3xl bg-white px-6 pt-6 shadow-xl transition-transform duration-300 hover:scale-105 md:ml-5">
      <div className="full flex flex-col">
        <div className="text-2xl font-[860] capitalize leading-7 tracking-tight text-slate-900 max-md:max-w-full">
          Special Product Sourcing
        </div>
        <div className="mr-0 mt-3 text-base leading-6 tracking-normal text-slate-600 xl:mr-6">
          We can source any product from China for you whilst guaranteeing the
          quality you will receive. To do this, we will create a WhatsApp group
          with our China team who will handle the sourcing for you.{' '}
        </div>
        <div className="w-full">
          <div className="flex justify-between gap-6 max-md:flex-col max-md:gap-0">
            <div className="flex w-8/12 flex-col max-md:ml-0 max-md:w-full">
              <div className="flex flex-col self-stretch text-base leading-6 text-slate-600 md:mt-5">
                <div className="w mr-2 tracking-normal max-md:mt-3">
                  We charge a sourcing commitment fee to begin. This money is
                  refunded when you go ahead to place an order.
                </div>
                <div className="mr-10 mt-5 tracking-normal max-md:mt-3">
                  We will provide a consolidated quote to you which will include
                  shipping and clearing.
                </div>
                {/* <div className="relative ml-5 mt-5 flex flex-col max-md:ml-0 max-md:w-full md:hidden">
                  <div className="absolute top-44 z-0 lg:-left-10 xl:-left-28 2xl:-left-28">
                    <Image
                      loading="lazy"
                      src="/icons/specialProductside.png"
                      alt="Special Product Sourcing Image"
                      width={153}
                      height={100}
                    />
                  </div>
                  <div className="z-10 mt-0 flex items-end justify-end md:mt-10 md:w-[300px] lg:mt-20 xl:mt-0 xl:w-[336px] 2xl:w-full">
                    <Image
                      loading="lazy"
                      src="/images/specialProductSouring.png"
                      alt="Special Product Sourcing Image"
                      width={336}
                      height={0}
                      className="h-auto w-full"
                    />
                  </div>
                </div> */}
                <Button
                  onClick={() => router.push('/auth/signup')}
                  className="md:mt-18 mb-7 mt-8 flex h-12 w-[157px] items-center gap-2 rounded-[72px] bg-indigo-800 font-[590px] text-white md:mb-6 lg:mb-5 xl:mt-20"
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
            </div>
            <div className="relative ml-5 flex flex-col max-md:ml-0 max-md:w-full">
              <div className="absolute top-44 z-0 md:-left-10 md:top-20 lg:-left-10 xl:-left-28 2xl:-left-28">
                <Image
                  loading="lazy"
                  src="/icons/specialProductside.png"
                  alt="Special Product Sourcing Image"
                  width={153}
                  height={100}
                />
              </div>

              <div className="z-10 mt-0 flex w-[250px] items-end justify-end sm:w-[300px] md:mt-16 md:w-[150px] lg:mt-10 xl:mt-0 xl:w-[315px] 2xl:w-[270px]">
                <Image
                  loading="lazy"
                  src="/images/specialProductSouring.png"
                  alt="Special Product Sourcing Image"
                  width={336}
                  height={0}
                  className="h-auto w-full rounded-none sm:rounded-2xl xl:rounded-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialProductSourcing;
