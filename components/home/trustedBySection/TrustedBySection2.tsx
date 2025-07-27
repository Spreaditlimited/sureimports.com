'use client';

import Image from 'next/image';
import { FC } from 'react';

interface LogoProps {
  src: string;
  alt: string;
  width: string;
  aspect: string;
}

const logos: LogoProps[] = [
  {
    src: '/home/trustedby/9jacodekids-white.svg',
    alt: '9jacodekids',
    width: 'w-[267px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/ANNEBLANCHE_white.svg',
    alt: 'anneblanche',
    width: 'w-[115px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/zimife_white.svg',
    alt: 'zimife',
    width: 'w-[174px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/Dahlin_white.svg',
    alt: 'dahlin',
    width: 'w-[107px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/9jacodekids-white.svg',
    alt: '9jacodekids',
    width: 'w-[267px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/ANNEBLANCHE_white.svg',
    alt: 'anneblanche',
    width: 'w-[115px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/zimife_white.svg',
    alt: 'zimife',
    width: 'w-[174px]',
    aspect: 'h-[40px]',
  },
  {
    src: '/home/trustedby/Dahlin_white.svg',
    alt: 'dahlin',
    width: 'w-[107px]',
    aspect: 'h-[40px]',
  },
];

const TrustedBySection: FC = () => {
  const newlogos = logos.concat(logos);

  return (
    <section className="relative overflow-hidden bg-[#161629] py-10">
      <h1 className="mb-10 text-center text-xl font-semibold uppercase text-white max-md:text-base">
        Trusted by over 30,000 merchants.
      </h1>
      <div className="relative flex overflow-x-hidden">
        <div className={`flex animate-infinite-scroll`}>
          {newlogos.map((logo, index) => (
            <div
              key={index}
              className={`mx-4 inline-block ${logo.width} ${logo.aspect}`}
            >
              <div className="relative h-full w-full">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  layout="fill"
                  objectFit="contain"
                  quality={100}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
