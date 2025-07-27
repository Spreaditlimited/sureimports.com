'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

interface PaySupplierSectionProps {
  imageUrl: string;
  imageAlt: string;
  linkHref: string;
  title: string;
  subtitle: string;
  paragraphs: string[];
  linkText: string;
  linkhref2: string;
  linktext2: string;
  images: ImageProps[];
  imageWrapperClasses?: string;
}

const ImageComponent: React.FC<ImageProps> = ({ src, alt, className = '' }) => (
  <div className={`relative h-14 ${className}`} style={{ height: '56px' }}>
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

const Section1: React.FC<PaySupplierSectionProps> = ({
  imageUrl,
  imageAlt,
  linkHref,
  title,
  subtitle,
  paragraphs,
  linkText,
  linkhref2,
  linktext2,
  images,
  imageWrapperClasses,
}) => {
  const router = useRouter();
  return (
    <div className="flex w-full items-center justify-center bg-white px-32 pt-40 max-xl:px-12 max-lg:px-10 max-md:mt-0 max-md:max-w-full max-md:px-5 max-md:pt-20">
      <div className="mt-2 w-full max-md:max-w-full">
        <div className="flex flex-col-reverse gap-5 max-lg:flex-col max-md:gap-0 md:flex-row">
          <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
            <div className="my-auto flex flex-col justify-center self-stretch text-base tracking-normal max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col max-md:max-w-full">
                <h2 className="px-8 text-5xl font-extrabold capitalize text-slate-900 max-lg:px-0 max-lg:text-4xl max-md:max-w-full">
                  {title}
                </h2>
                <p className="mt-5 px-8 text-base font-normal leading-6 text-slate-600 max-lg:px-0 max-md:max-w-full">
                  {paragraphs[0]}
                </p>
                <p className="mt-5 px-8 text-base font-normal leading-6 text-slate-600 max-lg:px-0 max-md:max-w-full">
                  {paragraphs[1]}
                </p>
                <p className="mt-5 px-8 text-base font-normal leading-6 text-slate-600 max-lg:px-0 max-md:max-w-full">
                  {paragraphs[2]}
                </p>
                {subtitle !== '' && (
                  <div className="mt-5 px-8 text-sm font-semibold text-slate-900 max-lg:px-0 max-md:max-w-full">
                    {subtitle}
                  </div>
                )}
                <div
                  className={`mt-3 flex flex-col flex-wrap content-start pl-8 max-lg:pl-0 ${imageWrapperClasses}`}
                >
                  <div className="flex flex-wrap gap-5">
                    {images.map((img, idx) => (
                      <ImageComponent key={idx} {...img} />
                    ))}
                  </div>
                </div>
                <div className="flex px-8 max-lg:px-0">
                  <Button
                    className="mt-5 h-12 w-48 font-normal"
                    onClick={() => router.push(linkHref)}
                  >
                    {linkText}
                  </Button>
                  {linktext2 !== '' && (
                    <Button
                      variant={'ghost'}
                      className="ml-2 mt-5 h-12 w-48 bg-slate-50 text-base font-normal"
                      onClick={() => router.push(linkhref2)}
                    >
                      {linktext2}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-6/12 flex-col max-xl:ml-0 max-md:w-full">
            <div className="flex w-full grow flex-col justify-center rounded-3xl max-md:mt-10 max-md:hidden max-md:max-w-full">
              <Image
                src={imageUrl}
                alt={imageAlt}
                layout="responsive"
                width={500}
                height={500}
                className="w-full max-md:max-w-full"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
