'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaySupplierSectionProps {
  imageUrl: string;
  imageAlt: string;
  linkHref: string;
  title: string;
  paragraphs: string[];
  linkText: string;
}

const Section1: React.FC<PaySupplierSectionProps> = ({
  imageUrl,
  imageAlt,
  linkHref,
  title,
  paragraphs,
  linkText,
}) => {
  const router = useRouter();
  return (
    <div className="flex w-full items-center justify-center bg-white px-32 pt-40 max-xl:px-12 max-lg:px-10 max-md:mt-0 max-md:max-w-full max-md:px-5 max-md:pt-20">
      <div className="mt-2 w-full max-md:max-w-full">
        <div className="flex flex-col-reverse gap-5 max-md:flex-col-reverse max-md:gap-0 md:flex-row">
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
          <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
            <div className="my-auto flex flex-col justify-center self-stretch text-base tracking-normal max-md:mt-10 max-md:max-w-full">
              <div className="flex flex-col px-8 max-lg:px-0 max-md:max-w-full">
                <h2 className="text-5xl font-extrabold capitalize leading-10 tracking-tight text-slate-900 max-lg:text-4xl max-md:max-w-full">
                  {title}
                </h2>
                <p className="mt-5 text-base font-normal leading-6 text-slate-600 max-md:max-w-full">
                  {paragraphs[0]}
                </p>
                <p className="mt-5 text-base font-normal leading-6 text-slate-600 max-md:max-w-full">
                  {paragraphs[1]}
                </p>
                <p className="mt-5 text-base font-normal leading-6 text-slate-600 max-md:max-w-full">
                  {paragraphs[2]}
                </p>
                <Button
                  className="mt-5 h-12 w-36"
                  onClick={() => router.push(linkHref)}
                >
                  {linkText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section1;
