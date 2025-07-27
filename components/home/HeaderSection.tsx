'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const HeaderSection: React.FC = () => {
  const router = useRouter();

  return (
    <section className="relative flex min-h-[768px] w-full flex-col overflow-hidden bg-white px-20 pb-20 pt-6 max-md:max-w-full max-md:px-5">
      <Image
        src="/images/hero-bg-2.png"
        alt=""
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 size-full scale-x-[-1] md:hidden"
        quality={100}
      />
      <Image
        src="/images/hero-background-1.png"
        alt=""
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 size-full max-md:hidden"
        quality={100}
      />
      <div className="relative mb-36 mt-52 flex w-[754px] max-w-full flex-col self-center">
        <h1 className="text-center text-5xl font-bold capitalize text-white max-md:max-w-full max-md:text-4xl">
          Get the best products from China at the best prices
        </h1>
        <Button
          onClick={() => router.push('/auth/login')}
          className="mt-8 h-12 self-center text-base font-semibold text-white"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};

export default HeaderSection;
