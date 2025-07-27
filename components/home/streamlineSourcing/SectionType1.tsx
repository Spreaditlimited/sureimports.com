import React from 'react';
import CustomImage from './CustomImage';

interface SectionProps {
  title: string;
  content: string[];
  linkText: string;
  linkHref: string;
  imageUrl: string;
  imageAlt: string;
}

const SectionType1: React.FC<SectionProps> = ({
  title,
  content,
  linkText,
  linkHref,
  imageUrl,
  imageAlt,
}) => (
  <div className="relative mt-16 flex w-full items-center justify-center px-16 py-20 transition-transform duration-300 hover:scale-105 max-lg:py-5 max-md:mt-10 max-md:px-5">
    <div className="relative w-full rounded-xl">
      <div className="absolute inset-0 z-10 rounded-xl"></div>
      <div className="flex flex-col gap-5 rounded-xl bg-white max-md:flex-col-reverse md:flex-row">
        <div className="flex w-full flex-col md:w-1/2">
          <div className="flex w-full grow flex-col justify-center rounded-3xl bg-white">
            <CustomImage src={imageUrl} alt={imageAlt} className="w-full" />
          </div>
        </div>
        <div className="flex w-full flex-col px-20 max-lg:px-5 max-md:px-0 md:w-1/2">
          <div className="my-auto flex flex-col justify-center text-base tracking-normal">
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold capitalize leading-10 tracking-tight text-slate-900">
                {title}
              </h2>
              <p className="mt-3 leading-6 text-slate-600">{content[0]}</p>
              <p className="mt-3 leading-6 text-slate-600 max-md:hidden">
                {content[1]}
              </p>
              <a
                className="mt-3 font-semibold leading-6 text-indigo-800 underline"
                href={linkHref}
              >
                {linkText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SectionType1;
