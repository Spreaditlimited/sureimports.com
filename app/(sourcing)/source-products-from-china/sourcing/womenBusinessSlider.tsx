'use client';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import 'aos/dist/aos.css';
import slide1 from '@/public/images/slide-image-1.png';
import slide12 from '@/public/images/slide-image-11.png';
import slide2 from '@/public/images/slide-image-2.png';
import slide3 from '@/public/images/slide-image-3.png';
import hero1 from '@/public/images/hero1.jpg';
import hero22 from '@/public/images/hero22.jpg';
import hero3 from '@/public/images/hero3.jpg';
const slideData = [
  {
    img: hero1,
    name: 'Chioma Ifeanyi-eze',
    icons: [slide1, slide12],
  },
  {
    img: hero22,
    name: 'Uduak Odungide',
    icons: [slide2],
  },
  {
    img: hero3,
    name: 'Roberta Edu',
    icons: [slide3],
  },
];

const WomenBusinessSlider = () => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1099,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
    ],
  };
  return (
    <section className="relative p-[50px_0px_30px] xl:p-[90px_0px_25px] xl14:p-[120px_0px_40px] xl17:pb-[60px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="rounded-3xl bg-gradient-to-r from-[#474784] from-0% to-[#161629] to-[95.54%] p-[40px_40px_75px] max-[389px]:p-[40px_26px_75px] md:rounded-[30px] xl:p-[60px_40px] xl16:p-[90px_80px]">
            <h2
              data-aos="fade-up"
              className="mb-[30px] text-center text-[42px] font-semibold capitalize leading-tight text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[22px] xl:mb-12"
            >
              <span className="hidden md:inline-block">Some</span> Top women-led
              businesses we serve
            </h2>
            <div data-aos="fade-up" className="mx-auto w-full max-w-[1430px]">
              <div className="banner-slider">
                <Slider {...settings}>
                  {slideData.map((item, index) => (
                    <div
                      key={index}
                      className="slide !flex h-full flex-row gap-4 rounded-[20px] bg-buy-sourcing-white p-[10px] max-md:flex-col max-sm:items-stretch sm:justify-between xl16:gap-5 xl16:!pr-5"
                    >
                      <div className="max-md:mx-auto max-md:w-full">
                        <div className="h-full max-sm:min-h-[136px] max-[420px]:w-full sm:min-h-[140px] xl16:min-h-[155px]">
                          <Image
                            src={item.img}
                            alt="image"
                            className="h-full w-full rounded-[19px] sm:object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex w-full flex-col items-start justify-center gap-4">
                        <p className="w-full text-lg font-semibold leading-snug text-black max-md:text-center max-[420px]:text-lg">
                          <span className="font-normal">by</span> {item.name}
                        </p>
                        <div className="flex w-full flex-row items-center justify-between rounded-[10px] bg-buy-sourcing-lightskyblue px-3 py-4 max-sm:mx-auto max-sm:w-[96%] max-[359px]:flex-col sm:flex-col sm:py-3 xl14:h-[68px] xl14:flex-row xl17:px-5">
                          {item.icons.map((icon, i) => (
                            <Image
                              key={i}
                              src={icon}
                              alt="icon"
                              className="mx-auto object-contain"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WomenBusinessSlider;
