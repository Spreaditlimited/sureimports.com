'use client';

import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AffiliateInfoProps = {
  title1: string;
  title2: string;
  title3: string;
  description: string;
  buttonLabel: string;
};

const AffiliateInfo: React.FC<AffiliateInfoProps> = ({
  title1,
  title2,
  title3,
  description,
  buttonLabel,
}) => {
  const router = useRouter();

  return (
    <section className="z-10 my-auto flex flex-col self-stretch max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col max-md:max-w-full">
        <h2 className="z-10 pr-20 text-4xl font-[860] capitalize text-white max-lg:pr-0 max-md:max-w-full">
          {title1} <span className="text-orange-400">{title2}</span> {title3}
        </h2>
        <p className="mt-5 pr-5 text-base font-normal text-white max-md:max-w-full max-md:text-sm">
          {description}
        </p>
      </div>
      <Button
        onClick={() =>
          router.push(`${process.env.NEXT_PUBLIC_LOGIN_SITE_URL}/`)
        }
        className="mt-8 h-12 w-52 rounded-3xl"
      >
        {buttonLabel}
      </Button>
    </section>
  );
};

const ProductSourcingSection: React.FC = () => {
  return (
    <main className="relative flex flex-col justify-center overflow-hidden">
      <div className="flex w-full items-center justify-center bg-white px-16 py-20 max-md:max-w-full max-md:px-5">
        <section
          style={{
            backgroundImage:
              'linear-gradient(102.53deg, #161629 37.43%, #4D4D8F 104.98%)',
          }}
          className="relative mb-5 mt-20 flex w-full justify-center rounded-[30px] bg-gradient-to-r from-[#161629] via-[#4D4D8F] to-[#4D4D8F] transition-transform duration-300 hover:scale-105 max-md:mt-10 max-md:max-w-full"
        >
          <div className="relative flex items-center max-lg:flex-col">
            <article className="flex w-6/12 flex-col py-20 pl-16 max-xl:w-7/12 max-lg:w-full max-md:ml-0 max-md:w-full max-md:px-5 max-md:py-10">
              <Link href={'/auth/login'}>
                <AffiliateInfo
                  title1="Experience a Hassle Free"
                  title2=" Product Sourcing"
                  title3="Solution"
                  description="We are committed to providing best in class product sourcing experience to you so that you focus on growing your business. Whatever product you need, we can find it and negotiate the best deals with Chinese suppliers, with a guarantee on quality."
                  buttonLabel="Start Product Sourcing"
                />
              </Link>
            </article>
            <div className="relative h-full w-1/2 max-lg:h-[500px] max-lg:w-full max-md:mt-20 max-md:h-[200px]">
              <div
                className="absolute bottom-0 w-full max-xl:right-[-20%] max-xl:w-[750px] max-lg:right-[-10%] max-md:right-[-50%] max-sm:right-[-200px]"
                style={{ height: 'calc(90% + 100px)' }}
              >
                <Image
                  loading="lazy"
                  src="/home/affiliate/affiliate-man-bg.png"
                  alt="Affiliate"
                  layout="fill"
                  objectFit="contain"
                  quality={100}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductSourcingSection;
