'use client';

import Image from 'next/image';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type ImageProps = {
  src: string;
  alt: string;
  className?: React.HTMLProps<HTMLElement>['className'];
};

type SectionProps = {
  title: string;
  description: string;

  images: ImageProps[];
  containerClasses: string;
  imageWrapperClasses: string;
};

const ShipingOnly: React.FC<SectionProps> = ({
  title,
  description,

  images,
  containerClasses,
  imageWrapperClasses,
}) => {
  const router = useRouter();
  return (
    <section
      className={`${containerClasses} ml-5 w-full pl-6 pr-3 pt-6 shadow-xl transition-transform duration-300 hover:scale-105`}
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-col text-base tracking-normal">
          <h2 className="text-2xl font-[860] capitalize leading-10 tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mr-2 mt-3 leading-6 text-slate-600">{description}</p>
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
        <div className="mr-5 mt-5 h-[1px] bg-slate-200 2xl:mt-10"></div>

        <div
          className={`mb-2 mt-5 flex flex-col flex-wrap content-start 2xl:mt-10 ${imageWrapperClasses}`}
        >
          <div className="flex flex-wrap items-end justify-normal gap-0 max-md:gap-2 lg:gap-5 xl:justify-start xl:gap-2 2xl:gap-8">
            {images.map((img, idx) => (
              <ImageComponent key={idx} {...img} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ImageComponent: React.FC<ImageProps> = ({ src, alt, className }) => (
  <div className={`relative ${className}`} style={{ height: '76.1px' }}>
    <Image
      loading="lazy"
      src={src}
      alt={alt}
      layout="fill"
      objectFit="contain"
      className="object-contain"
      quality={100}
    />
  </div>
);

export default ShipingOnly;
