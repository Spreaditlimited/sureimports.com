'use client';
import React, { useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import linkArrow from '@/public/images/linkArrow.svg';
import Link from 'next/link';

type StepItemProps = {
  number: string;
  icon: StaticImageData;
  title: string;
  description: string;
};

const StepItem = ({ number, icon, title, description }: StepItemProps) => (
  <div className="s14:py-6 flex flex-row items-start gap-5 border-b border-black/25 py-[15px] last:border-transparent max-[389px]:gap-3 md:py-5 lg:gap-11">
    <p className="text-xl font-semibold uppercase leading-none text-[#A7A6D6] lg:text-[26px]">
      {number}
    </p>
    <div className="flex items-start gap-5 max-[389px]:gap-3 lg:gap-7">
      <Image
        src={icon}
        alt={`icon-${number}`}
        className="s14:size-9 size-[26px] max-[389px]:size-5"
      />
      <div className="xl17:pr-5">
        <h3 className="mb-[11px] text-lg font-semibold leading-relaxed text-black max-[389px]:text-base">
          {title}
        </h3>
        <p className="text-gray text-base font-normal max-sm:pr-5 max-[389px]:text-sm">
          {description}
        </p>
      </div>
    </div>
  </div>
);

type Step = {
  number: string;
  icon: any;
  title: string;
  description: string;
};

type WorksProps = {
  title?: string;
  videoUrl: string;
  steps: Step[];
  buttonLabel?: string;
  buttonUrl?: string;
};

const HowWorks: React.FC<WorksProps> = ({
  title,
  videoUrl,
  steps,
  buttonLabel = 'Submit Sourcing Request',
  buttonUrl = '#',
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="bg-lightskyblue p-[120px_0px_120px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[50px_0px_35px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div data-aos="fade-up" className="grid grid-cols-12">
            <div className="col-span-full lg:col-span-6 lg:pr-10">
              <h3 className="gradient-text text-[42px] font-semibold capitalize leading-none text-white max-xl:text-[26px] max-md:text-center max-sm:text-[36px] max-[390px]:text-[29px]">
                {title}
              </h3>
              <div className="mt-[30px] rounded-2xl border border-white/15 bg-white/70 p-[10px] shadow-customboxshadow lg:rounded-[30px] lg:p-5 xl:mt-12">
                <div className="h-[257px] sm:h-96 lg:h-[440px] xl:h-[550px]">
                  <iframe
                    width="100%"
                    height="100%"
                    src={videoUrl}
                    title="How it works video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-[14px] max-lg:mx-auto lg:rounded-[22px]"
                  ></iframe>
                </div>
              </div>
            </div>
            <div className="col-span-full lg:col-span-6">
              <div className="flex h-full flex-col justify-end max-lg:mt-[15px]">
                {steps.map((step, index) => (
                  <StepItem key={index} {...step} />
                ))}
              </div>
            </div>
          </div>
          <div data-aos="fade-up" className="mt-8 lg:mt-10">
            <Link
              href={'/auth/signup-sourcing'}
              className="mx-auto mt-5 flex w-fit items-center justify-center gap-[10px] rounded-[30px] bg-buy-sourcing-blue p-[10px_30px] text-base font-medium leading-[155%] text-white transition-all hover:bg-indigo-700 md:mt-[30px] md:text-lg"
            >
              {buttonLabel}
              <Image src={linkArrow} alt="linkArrow" className="w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWorks;
