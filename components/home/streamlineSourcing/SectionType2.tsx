import React from 'react';
import Image from 'next/image';

interface PaySupplierSectionProps {
  imageUrl: string;
  imageAlt: string;
  linkHref: string;
  title: string;
  paragraphs: string[];
  linkText: string;
}

const SectionType2: React.FC<PaySupplierSectionProps> = ({
  imageUrl,
  imageAlt,
  linkHref,
  title,
  paragraphs,
  linkText,
}) => (
  <div className="mt-16 flex w-full items-center justify-center bg-slate-100 px-16 py-20 transition-transform duration-300 hover:scale-105 max-md:mt-10 max-md:max-w-full max-md:px-5 max-md:py-8">
    <div className="mt-2 w-full max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex w-6/12 flex-col max-md:ml-0 max-md:w-full">
          <div className="my-auto flex flex-col justify-center self-stretch text-base tracking-normal max-md:mt-10 max-md:max-w-full">
            <div className="flex flex-col max-md:max-w-full">
              <h2 className="text-3xl font-extrabold capitalize leading-10 tracking-tight text-slate-900 max-md:max-w-full">
                {title}
              </h2>
              <p className="mt-3 leading-6 text-slate-600 max-md:max-w-full">
                {paragraphs[0]}
              </p>
              <p className="mt-3 leading-6 text-slate-600 max-md:hidden max-md:max-w-full">
                {paragraphs[1]}
              </p>
              <a
                className="mt-3 font-semibold leading-6 text-indigo-800 underline max-md:max-w-full"
                href={linkHref}
              >
                {linkText}
              </a>
            </div>
          </div>
        </div>
        <div className="ml-5 flex w-[54%] flex-col max-md:ml-0 max-md:w-full">
          <div className="flex w-full grow flex-col justify-center rounded-3xl bg-white max-md:mt-10 max-md:max-w-full">
            <Image
              src={imageUrl}
              alt={imageAlt}
              layout="responsive"
              width={500}
              height={500}
              className="aspect-[1.2] w-full max-md:max-w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SectionType2;
