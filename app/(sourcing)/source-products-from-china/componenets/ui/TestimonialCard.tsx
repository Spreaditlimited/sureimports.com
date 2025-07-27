'use client';
import React, { useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
export interface TestimonialCardProps {
  name: string;
  location: string;
  quote: string;
  image: StaticImageData;
  title?: string;
  backgroundColor?: string;
  backgroundShadow?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  quote,
  image,
  title,
  backgroundColor,
  backgroundShadow,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="relative z-[2]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          {title ? (
            <h4
              data-aos="fade-up"
              className="gradient-text mb-[30px] text-center text-[42px] font-semibold capitalize leading-snug text-white max-xl:text-[26px] max-sm:text-[36px] max-[420px]:text-[28px] lg:mb-12"
            >
              {title}
            </h4>
          ) : (
            <></>
          )}
          <div data-aos="fade-up">
            <div
              style={
                backgroundColor
                  ? {
                      background: backgroundColor,
                      boxShadow: backgroundShadow,
                    }
                  : {}
              }
              className="s15:gap-[60px] flex items-stretch gap-5 rounded-[30px] p-5 max-lg:flex-col lg:gap-9"
            >
              <div className="relative h-[180px] sm:h-60 md:h-[440px] lg:h-60 lg:w-72 xl:w-80 xl14:min-h-[253px] xl14:w-[348px]">
                {/* <div className="relative min-h-[180px] sm:h-64 lg:w-72 xl:w-80 s14:w-[348px]"> */}
                <Image
                  src={image}
                  alt={`${name} Testimonial`}
                  className="h-full w-full rounded-[20px] object-cover max-md:object-top md:rounded-[30px]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center max-lg:text-center xl:pr-8 xl14:pr-24 xl15:pr-32 xl16:pr-44 xl17:pr-56">
                <p className="text-base font-normal leading-relaxed text-black max-sm:px-2 md:text-lg">
                  {quote}
                </p>
                <div className="mt-4 md:mt-6 lg:mt-8">
                  <h2 className="mb-[10px] text-lg font-semibold capitalize leading-none text-black md:mb-[15px] md:text-[22px]">
                    {name}
                  </h2>
                  <span className="text-gray mt-2 text-base font-medium capitalize md:text-lg">
                    - {location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCard;
