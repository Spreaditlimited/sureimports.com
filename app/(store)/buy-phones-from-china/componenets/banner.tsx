'use client';
import React, { useEffect } from 'react';
import Whitebtn from './ui/whitebtn';
import Link from 'next/link';
import SignupForm from './ui/signupform';
import Image from 'next/image';
import beforeshape from '@/public/images/beforeshape.svg';
import banner from '@/public/images/banner.png';
import mobilebanner from '@/public/images/mobilebanner.png';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Banner: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="banner-image relative pb-[75px] pt-[190px] max-xl17:pb-[50px] max-xl17:pt-[100px] max-xl14:pt-[120px] max-xl:pb-[30px] max-xl:pt-[140px] max-lg:pb-[10px] max-lg:pt-[90px] max-md:pb-[35px] max-sm:pb-[0px] max-sm:pt-[70px] max-[120px]:pt-[10px]">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-[-1]">
        <Image
          className="h-full w-full object-cover max-sm:hidden"
          src={banner}
          alt="banner"
        />
        <Image
          className="hidden h-[1075px] w-full object-cover max-sm:block"
          src={mobilebanner}
          alt="banner"
        />
      </div>
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="flex gap-[40px] max-xl:flex-wrap">
            <div
              className="w-full max-w-[573px] max-lg:mb-[40px] max-lg:max-w-[100%] max-lg:text-center"
              data-aos="fade-up"
            >
              <span className="rounded-[23px] bg-store-bglightwhite p-[12px_23px] text-[16px] font-normal leading-[150%] text-store-white max-[420px]:text-[12px]">
                We ship only genuine devices. No fakes.
              </span>
              <h1 className="main-title mt-[24px] text-[42px] font-semibold uppercase leading-[176%] text-store-white max-xl:text-[26px] max-sm:mt-[30px] max-sm:hidden max-sm:text-[30px] max-sm:leading-[166%] max-[420px]:text-[22px]">
                Buy phones & laptops from china - with ease, confidence and
                warranty
              </h1>
              <h1 className="main-title mt-[24px] hidden text-[42px] font-semibold uppercase leading-[176%] text-store-white max-xl:text-[26px] max-sm:mx-[-15px] max-sm:mt-[30px] max-sm:block max-sm:text-[30px] max-sm:leading-[166%] max-[420px]:text-[22px]">
                Buy genuine phones and laptops from china
              </h1>
              <p className="mt-[10px] max-w-[523px] text-[20px] font-normal leading-[190%] text-store-white max-xl:text-[18px] max-lg:mx-auto max-sm:mt-[15px] max-sm:hidden max-sm:leading-[155%] max-[420px]:text-[16px]">
                Get brand new and pre-owned phones or laptops shipped directly
                from China. Choose to pay in full or spread your payment with
                our Pay Small Small option.
              </p>
              <p className="mt-[10px] hidden max-w-[523px] text-[20px] font-normal leading-[190%] text-store-white max-xl:text-[18px] max-lg:mx-auto max-sm:mt-[15px] max-sm:block max-sm:leading-[155%] max-[420px]:text-[16px]">
                Get brand new and pre-owned devices, shipped directly from
                China. Pay in full or with our flexible “Pay Small Small”
                option.
              </p>
              <div className="banner-btn-group mt-[30px] flex gap-[15px] max-lg:justify-center max-sm:hidden">
                <Link
                  href="/auth/signup-store"
                  className="duration-[0.3s] inline-flex items-center justify-center rounded-[30px] border border-store-white bg-store-lightwhitebg p-[11px_42px] text-[18px] font-medium leading-[155%] text-store-white transition-all hover:bg-store-white hover:text-store-blue max-xl14:p-[11px_30px] max-xl14:text-[15px]"
                >
                  Browse Devices
                </Link>
                <Whitebtn
                  href="/pricing"
                  text="Start with ₦5,000"
                  className="max-xl14:text-[15px]"
                />
              </div>
            </div>
            <div
              className="mt-[-50px] w-full max-w-[310px] max-xl:mx-auto max-lg:max-w-[100%]"
              data-aos="fade-up"
            >
              <div className="youtube-video-block ml-[10px] w-full max-sm:ml-[0px]">
                <iframe
                  width="100%"
                  height="347"
                  src="https://www.youtube.com/embed/kmFhSImPW4A?si=bMTxCbaixnMlYQZu"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-[20px] max-lg:mx-auto"
                ></iframe>
              </div>
              <p className="mx-auto mt-[15px] max-w-[291px] text-center text-[18px] font-normal leading-[155%] text-store-white max-sm:hidden">
                Buying premium phones and laptops from China has never been
                easier.
              </p>
            </div>
            <div
              className="form-block ml-[12px] w-full max-w-[612px] max-xl:mx-auto max-sm:ml-[0px] max-sm:mt-[10px]"
              data-aos="fade-up"
            >
              <div className="back-overlay">
                <Image className="" src={beforeshape} alt="shape" />
              </div>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
