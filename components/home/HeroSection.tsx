'use client';

import * as React from 'react';
//import SignupPage from '@/components/home/sign-up-herosection';
import SignupPage from '@/app/auth/signup/components/SignUpForm2';
import NotificationStrip from './NotificationStrip';
import YouTubeFrame from '../uix/YouTubeFrame';

const HeroSection: React.FC = () => {
  return (
    <>
      <section className="relative flex min-h-[468px] w-full flex-col justify-between overflow-hidden bg-[#161629] px-20 pt-0 max-md:max-w-full max-md:px-5 lg:flex-row">
        <div className="relative mb-5 mt-10 max-w-full flex-col self-start max-2xl:w-full sm:pt-20 md:flex md:pt-20 lg:mb-36 xl:mt-14 xl:pr-40">
          <h1 className="text-left text-5xl font-bold text-white max-md:max-w-full max-md:text-4xl">
            {/* Say Goodbye to the Fear of Receiving Poor Quality or Incorrect
            Products From China. */}
            Buy from China with Confidence
          </h1>

          <p className="mt-6 text-left text-xl font-normal text-white max-md:max-w-full max-md:pr-10 max-md:text-base xl:pr-20">
            {/* We guarantee the quality and accuracy of every item we source,
            ensuring you get exactly what you ordered, every time. */}
            Say goodbye to the fear of receiving poor quality or incorrect
            products from China. We guarantee the quality and accuracy of every
            item we source, ensuring you get exactly what you ordered, every
            time.
          </p>

          <div className="min-h-screenx mt-10 flex items-center justify-center rounded-lg bg-gray-100 lg:mt-5">
            <iframe
              className="rounded-lg p-3"
              width="100%"
              height="426"
              src="https://www.youtube.com/embed/g5U0QY4LuNk"
              title="Explore the various ways we work with you to deliver the exact products you want from China."
              //frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="max-2xl:w-full max-md:w-full">
          <SignupPage />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
