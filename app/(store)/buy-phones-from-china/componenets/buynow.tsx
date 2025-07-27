'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import play from '@/public/images/play.svg';
import pause from '@/public/images/pause.svg'; // Although unused, kept in case you need it later
import info from '@/public/images/info.svg';
import Bluebtn from './ui/bluebtn';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface VideoItem {
  youtubeId: string;
  poster: string;
  title: string;
  description: string;
  overlayText: string;
  overlayClass?: string;
}

const Buynow: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const videoData: VideoItem[] = [
    {
      youtubeId: 'YSUZS4A0F4w',
      poster: '/images/poster1.png',
      title: 'iPhones',
      description: 'Genuine iPhones (Brand New and Pre-owned)',
      overlayText: 'Genuine iPhones (Brand New and Pre-owned)',
    },
    {
      youtubeId: 'Ml_OCW7z0gk',
      poster: '/images/poster2.png',
      title: 'Samsung and Google Pixel',
      description:
        'Authentic Samsung and Google Pixel phones (Brand new and Pre-owned)',
      overlayText:
        'Authentic Samsung and Google Pixel phones (Brand new and Pre-owned)',
      overlayClass: 'max-sm:max-w-[244px] max-w-[224px]',
    },
    {
      youtubeId: 'hkaOgBrpGcQ',
      poster: '/images/poster3.png',
      title: 'Windows Laptops',
      description: 'High performance Pre-owned HP, Asus, Lenovo laptops',
      overlayText: 'High performance Pre-owned HP, Asus, Lenovo laptops',
      overlayClass: '!text-[#161629]',
    },
    {
      youtubeId: 'wPs540cuYRY',
      poster: '/images/poster4.png',
      title: 'MacBooks',
      description: 'Genuine and High-performance Pre-owned MacBooks.',
      overlayText: 'Genuine and High-performance Pre-owned MacBooks.',
      overlayClass: '!text-[#161629] max-w-[350px]',
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
    <div className="bg-store-lightskyblue p-[120px_0px_128px] max-xl17:p-[50px_0px] max-xl15:p-[35px_0px] max-xl14:p-[35px_0px] max-xl:p-[35px_0px] max-lg:p-[25px_0px] max-sm:p-[50px_0px_30px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <h2
            className="gradient-text text-center text-[42px] font-semibold capitalize leading-normal text-store-purple max-sm:px-[10px] max-sm:text-[36px] max-sm:leading-[46px] max-[420px]:text-[26px] max-[420px]:leading-[36px]"
            data-aos="fade-up"
          >
            Products We Ship From China
          </h2>
          <p
            className="mt-[15px] text-center text-[18px] font-medium leading-[211%] text-black max-sm:leading-[155%]"
            data-aos="fade-up"
          >
            What can you buy from Sure Imports?
          </p>
          <div className="mt-[50px] grid grid-cols-12 gap-[30px] max-xl:gap-[20px] max-sm:mt-[30px] max-sm:gap-[30px_0px]">
            {videoData.map((item, index) => (
              <div
                key={index}
                className="col-span-3 max-lg:col-span-6 max-sm:col-span-12"
              >
                <div className="h-full" data-aos="fade-up">
                  <div
                    className="relative h-[513px] max-xl14:h-[400px] max-xl:h-[350px] max-sm:h-[513px] max-[420px]:h-[450px]"
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {playingIndex === index ? (
                      <iframe
                        className="h-full w-full rounded-[20px]"
                        src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&mute=1&rel=0&controls=1&modestbranding=1`}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <Image
                          src={item.poster}
                          alt={item.title}
                          fill
                          className="rounded-[20px] object-cover"
                          style={{ zIndex: 1 }}
                        />
                        <div className="absolute inset-0 z-[2] rounded-[20px] bg-black/20" />
                        {/* <div className={`absolute top-0 left-0 right-0 z-[3] p-[25px] max-sm:p-[25px_42px_25px_25px] text-store-white shadow-sm text-[18px] font-medium leading-[155%] max-xl:text-[15px] ${item.overlayClass || ''}`}> */}
                        <div
                          className={`absolute left-0 right-0 top-0 z-[3] p-[25px] text-[18px] font-medium leading-[155%] text-store-white shadow-sm max-xl:text-[15px] max-sm:p-[25px_42px_25px_25px]`}
                        >
                          {item.overlayText}
                        </div>
                        {/* </div> */}
                        {(hoverIndex === index || !playedOnce[index]) && (
                          <div
                            className="absolute left-[50%] top-[50%] z-[4] flex h-[76px] w-[76px] translate-x-[-50%] translate-y-[-50%] cursor-pointer items-center justify-center rounded-[76px] border border-store-white bg-store-lightblack pl-[3px] shadow-customshadow backdrop-opacity-[.2] max-xl:h-[60px] max-xl:w-[60px] max-sm:h-[76px] max-sm:w-[76px]"
                            onClick={() => handlePlay(index)}
                          >
                            <Image className="w-[25px]" src={play} alt="play" />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="buy-now-main-block relative z-[99] mt-[-100px] p-[0px_15px] max-sm:mt-[-100px]">
                    <div className="buy-now-block flex h-full flex-col justify-between rounded-[19px] bg-store-white p-[20px_10px_20px_20px] shadow-customboxshadow max-sm:p-[20px_15px_20px_20px]">
                      <div>
                        <h4 className="text-[24px] font-semibold leading-[125%] text-store-darkblack max-xl14:text-[20px] max-sm:text-[24px]">
                          {item.title}
                        </h4>
                        <p className="text-gray mt-[10px] text-[18px] font-normal leading-[155%] max-xl14:text-[15px] max-sm:text-[18px]">
                          {item.description}
                        </p>
                      </div>
                      <div className="mt-[15px]">
                        <Bluebtn affiliateRef={'12345'} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[50px] flex items-start justify-center gap-[12px]">
            <Image src={info} alt="info" />
            <p className="text-[16px] font-normal leading-[150%] text-black">
              All devices are sourced, tested, and verified before shipping and
              arrives in 10 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buynow;
