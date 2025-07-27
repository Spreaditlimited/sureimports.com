'use client';
import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import icon1 from '@/public/images/icon1.svg';
import icon2 from '@/public/images/icon2.svg';
import icon3 from '@/public/images/icon3.svg';
import icon4 from '@/public/images/icon4.svg';
import icon5 from '@/public/images/icon5.svg';
import play from '@/public/images/play.svg';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Type for items with icons and text
type InfoItem = {
  icon: StaticImageData;
  text: string;
};

// Type for video items
type VideoItem = {
  youtubeId: string;
  poster: string;
  caption: string;
  title?: string;
  overlayText?: string;
  overlayClass?: string;
};

const Whysureimports: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const videoItems: VideoItem[] = [
    {
      youtubeId: 'jVHHwQJ_ybc',
      poster: '/images/poster5.png',
      caption:
        'A satisfied customer who bought one of our pre-owned iPhones in April 2024.',
    },
    {
      youtubeId: 'n1oCQir1ufg',
      poster: '/images/poster6.png',
      caption:
        'Another satisfied customer who has bought two pre-owned iPhones from us so far.',
    },
  ];

  const items: InfoItem[] = [
    {
      icon: icon1,
      text: 'We’ve been sourcing products from China since 2018 with over 30,000 registered customers.',
    },
    {
      icon: icon2,
      text: 'We only deal with trusted, verified suppliers',
    },
    {
      icon: icon3,
      text: 'We inspect every product before shipping',
    },
    {
      icon: icon4,
      text: 'We consolidate orders to give you the best shipping value',
    },
    {
      icon: icon5,
      text: 'You get support before, during, and after delivery',
    },
  ];

  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [playedOnce, setPlayedOnce] = useState<boolean[]>([]);

  const handlePlay = (index: number) => {
    setPlayingIndex(index);
    setPlayedOnce((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <div className="overflow-hidden bg-store-lightskyblue p-[100px_0px_72px] max-xl17:p-[50px_0px_25px] max-xl:p-[40px_0px_25px] max-lg:p-[20px_0px_10px] max-sm:p-[50px_0px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <div className="grid grid-cols-12 max-xl17:gap-[30px] max-[420px]:gap-[30px_0px]">
            <div className="col-span-6 max-lg:col-span-12">
              <div
                className="w-full max-w-[742px] pt-[75px] max-lg:max-w-full max-lg:pt-[0px]"
                data-aos="fade-up"
              >
                <div className="max-lg:text-center">
                  <h2 className="gradient-text inline-block text-[42px] font-semibold capitalize leading-normal max-sm:text-[36px] max-[420px]:text-[30px]">
                    Why Sure Imports?
                  </h2>
                </div>
                <div className="mt-[50px] max-sm:mt-[43px]">
                  <ul className="flex flex-col gap-[25px_0px] max-sm:gap-[20px_0px]">
                    {items.map((item, index) => (
                      <li
                        key={index}
                        className="border-b-solid flex min-h-[76px] items-center gap-[30px] border-b-[1px] border-b-[#CBCBCB] pb-[20px] pr-[74px] text-[18px] font-medium leading-[155%] text-store-darkblack max-sm:gap-[20px] max-sm:pr-[0px] max-sm:text-[16px]"
                      >
                        <Image src={item.icon} alt="icon" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-span-6 max-lg:col-span-12">
              <div
                className="video-part-block grid grid-cols-12 gap-[17px] max-sm:gap-[30px] max-[420px]:gap-[30px_0px]"
                data-aos="fade-up"
              >
                {videoItems.map((item, index) => (
                  <div
                    key={index}
                    className="col-span-6 last:mt-[138px] max-lg:last:mt-[0px] max-sm:col-span-12"
                  >
                    <div className="video-wrp-block">
                      <div
                        className="relative h-[513px] overflow-hidden rounded-[20px] max-xl14:h-[450px] max-xl:h-[370px] max-sm:h-[513px] max-[420px]:h-[400px]"
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        {playingIndex === index ? (
                          <iframe
                            className="h-full w-full rounded-[20px]"
                            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&rel=0&controls=1&modestbranding=1`}
                            title={item.title ?? 'Customer Video'}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <>
                            <Image
                              src={item.poster}
                              alt={item.title ?? 'Video poster'}
                              fill
                              className="rounded-[20px] object-cover"
                              style={{ zIndex: 1 }}
                            />
                            <div className="absolute inset-0 z-[2] rounded-[20px] bg-store-black/20" />
                            <div
                              className={`absolute left-0 right-0 top-0 z-[3] p-[25px] text-[18px] font-medium leading-[155%] text-store-white max-xl:text-[15px] max-sm:p-[25px_42px_25px_25px] ${item.overlayClass ?? ''}`}
                            >
                              {item.overlayText ?? ''}
                            </div>
                            {(hoverIndex === index || !playedOnce[index]) && (
                              <div
                                className="absolute left-[50%] top-[50%] z-[4] flex h-[76px] w-[76px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-[76px] border border-store-white bg-store-lightblack pl-[3px] shadow-customshadow backdrop-opacity-[.2] max-xl:h-[60px] max-xl:w-[60px] max-sm:h-[76px] max-sm:w-[76px]"
                                onClick={() => handlePlay(index)}
                              >
                                <Image
                                  className="w-[25px]"
                                  src={play}
                                  alt="play"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      <div className="mt-[15px] pr-[40px] max-sm:mt-[25px] max-sm:pr-[0px] max-sm:text-center">
                        <p className="text-[20px] font-medium leading-[160%] text-store-darkblack max-xl:text-[16px] max-sm:text-[18px]">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whysureimports;
