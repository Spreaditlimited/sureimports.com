'use client';

import React, { useRef, useState, useEffect } from 'react';
import Slider, { Settings } from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Bluebtn from './ui/bluebtn';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Slide {
  id: number;
  img: string;
  number: string;
  info: string;
}

const Getstarted: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState<number>(5); // default

  const slides: Slide[] = [
    {
      id: 1,
      img: '/images/notpen.svg',
      number: '01',
      info: 'Create a free account',
    },
    {
      id: 2,
      img: '/images/slidericon2.svg',
      number: '02',
      info: 'Verify your email and sign into your account ',
    },
    {
      id: 3,
      img: '/images/slidericon3.svg',
      number: '03',
      info: 'Browse, select a product, and choose either Pay in Full or Pay Small Small',
    },
    {
      id: 4,
      img: '/images/slidericon4.svg',
      number: '04',
      info: 'If you choose Pay Small Small, you’ll get your dedicated account instantly',
    },
    {
      id: 5,
      img: '/images/slidericon5.svg',
      number: '05',
      info: 'Complete payment — and we ship directly to our Lagos office',
    },
  ];

  const updateSlidesToShow = () => {
    const width = window.innerWidth;
    if (width < 500) setCurrentSlidesToShow(1);
    else if (width < 768) setCurrentSlidesToShow(2);
    else if (width < 1024) setCurrentSlidesToShow(3);
    else if (width < 1280) setCurrentSlidesToShow(4);
    else setCurrentSlidesToShow(5);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const settings: Settings = {
    dots: false,
    arrows: false,
    infinite: slides.length > currentSlidesToShow,
    speed: 500,
    slidesToShow: currentSlidesToShow,
    slidesToScroll: 1,
    swipe: slides.length > currentSlidesToShow,
    draggable: slides.length > currentSlidesToShow,
    touchMove: slides.length > currentSlidesToShow,
    afterChange: (index: number) => setActiveSlide(index),
    responsive: [
      { breakpoint: 1279, settings: { slidesToShow: 4 } },
      { breakpoint: 1023, settings: { slidesToShow: 3 } },
      { breakpoint: 767, settings: { slidesToShow: 2 } },
      { breakpoint: 500, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="bg-store-lightskyblue p-[120px_0px] max-xl17:p-[45px_0px] max-xl14:p-[35px_0px] max-xl:p-[30px_0px] max-lg:p-[30px_0px_30px] max-sm:p-[65px_0px_50px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="text-center">
            <h2
              className="gradient-text inline-block text-[42px] font-semibold leading-normal max-lg:text-[36px] max-[420px]:text-[30px]"
              data-aos="fade-up"
            >
              How To Get Started?
            </h2>
            <p
              className="mx-auto mt-[20px] max-w-[824px] text-[18px] font-medium leading-[166%] text-black max-sm:mt-[15px] max-sm:px-[11px] max-sm:text-[16px]"
              data-aos="fade-up"
            >
              Getting your phone or laptop from Sure Imports is simple. Just
              follow these quick steps to set up your account, choose a device,
              and pick how you want to pay.
            </p>
            <div
              className="mt-[30px] justify-center max-xl:flex xl:hidden"
              data-aos="fade-up"
            >
              <Bluebtn
                text="Get Started Now"
                className="p-[12px_30px!important]"
              />
            </div>
          </div>

          <div className="mt-[50px] max-sm:mt-[10px]" data-aos="fade-up">
            <Slider
              ref={sliderRef}
              {...settings}
              className="get-started-slider"
            >
              {slides.map((slide) => (
                <div key={slide.id} className="h-full">
                  <div className="get-started-slider-block h-full rounded-[20px] border border-solid border-[#F4F4F4] bg-store-white p-[40px_25px] max-sm:p-[30px_45px_30px_25px]">
                    <div className="flex items-center justify-between">
                      <Image
                        src={slide.img}
                        alt={`Slide ${slide.id}`}
                        width={45}
                        height={45}
                        className="object-contain"
                      />
                      <span className="text-[48px] font-bold uppercase leading-normal text-store-lightpurple max-sm:text-[36px]">
                        {slide.number}
                      </span>
                    </div>
                    <div className="mt-[32px]">
                      <p className="text-[18px] font-semibold leading-[166%] text-black">
                        {slide.info}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            {slides.length > currentSlidesToShow && (
              <div className="mt-[10px] flex justify-center gap-[10px]">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      sliderRef.current?.slickGoTo(index);
                      setActiveSlide(index);
                    }}
                    className={`custom-dots h-[10px] w-[10px] cursor-pointer rounded-full ${activeSlide === index ? 'bg-[#3730A3]' : 'bg-[#CBDEFF]'}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            className="mt-[30px] flex justify-center max-xl:hidden"
            data-aos="fade-up"
          >
            <Bluebtn
              text="Get Started Now"
              className="p-[12px_30px!important]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Getstarted;
