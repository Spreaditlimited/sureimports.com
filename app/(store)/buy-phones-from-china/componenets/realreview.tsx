'use client';
import React, { useState, useEffect } from 'react';
import Marquee from 'react-fast-marquee';
import Image, { StaticImageData } from 'next/image';
import reviewimage from '@/public/images/reviewimage.png';
import review1 from '@/public/images/review1.png';
import review2 from '@/public/images/review2.png';
import review3 from '@/public/images/review3.png';
import review4 from '@/public/images/review4.png';
import review5 from '@/public/images/review5.png';
import Bluebtn from './ui/bluebtn';

const Realreview: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind 'sm' breakpoint
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allReviews: StaticImageData[] = [
    reviewimage,
    review1,
    review2,
    review3,
    review4,
    review5,
  ];
  const mobileReviews: StaticImageData[] = [review2, review4];

  return (
    <div className="logo-slider-part py-[120px] max-xl17:py-[60px] max-xl15:py-[55px] max-xl:py-[50px] max-sm:bg-store-lightskyblue max-sm:p-[50px_0px_0px] max-sm:py-[50px] max-sm:pb-[0px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="mb-[50px] max-xl15:mb-[30px] max-sm:mb-[30px]">
            <div className="text-center">
              <h2 className="gradient-text inline-block text-[42px] font-semibold leading-[80px] max-lg:text-[36px] max-lg:leading-[48px] max-sm:px-[10px] max-[420px]:text-[30px]">
                Real Reviews From Real Customers
              </h2>
            </div>
            <div className="mt-[30px] hidden justify-center max-md:flex">
              <Bluebtn
                href="/auth/signup-store"
                text="Create a Free Account"
                className="p-[12px_30px!important]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="real-review-slider relative">
        <div className="px-[30px] max-sm:px-[20px]">
          <div className="fix-width">
            {isMobile ? (
              <div className="h-[1000px] overflow-hidden max-sm:h-auto max-sm:overflow-visible">
                <div className="animate-vertical-scroll flex flex-col gap-[10px_0px]">
                  {mobileReviews.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt="review"
                      className="w-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <Marquee>
                {allReviews.concat(allReviews).map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    alt="review"
                    className="w-[400px] rounded-[20px]"
                  />
                ))}
              </Marquee>
            )}
          </div>
        </div>
      </div>

      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="mt-[50px] flex justify-center max-md:hidden">
            <Bluebtn
              href="/auth/signup-store"
              text="Create a Free Account"
              className="p-[12px_30px!important]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Realreview;
