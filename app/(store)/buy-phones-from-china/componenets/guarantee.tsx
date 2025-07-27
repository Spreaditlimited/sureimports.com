'use client';
import React, { useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import mobilepcimg from '@/public/images/mobilepcimg.png';
import mobilepcimage from '@/public/images/mobilepcimage.png';
import vectrorlinewithtriangle from '@/public/images/vectrorlinewithtriangle.svg';
import iconimg from '@/public/images/iconimg.svg';
import Bluebtn from './ui/bluebtn';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface GuaranteeItem {
  title: string;
  description: string;
  icon: StaticImageData;
}

const Guarantee: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const items: GuaranteeItem[] = [
    {
      title: 'Phones (new or pre-owned)',
      description: 'Covered by 1-Year Sure Imports Warranty',
      icon: iconimg,
    },
    {
      title: 'Pre-owned Laptops',
      description: 'Covered by 3-Month Sure Imports Warranty',
      icon: iconimg,
    },
  ];

  return (
    <div className="overflow-hidden p-[205px_0px_60px] max-xl17:p-[130px_0px_30px] max-xl15:p-[90px_0px_10px] max-xl:p-[40px_0px_20px] max-lg:p-[20px_0px_10px] max-sm:p-[50px_0px_25px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width guarentee-bg flex rounded-[40px] pr-[70px] max-xl14:pr-[20px] max-lg:flex-col max-lg:p-[20px_25px] max-sm:rounded-[30px] max-sm:p-[44px_25px_20px] max-[420px]:p-[30px_20px_20px]">
          <div
            className="mobilepcimgblock relative left-[-20px] mt-[-150px] max-xl15:mt-[-120px] max-xl14:mt-[-100px] max-xl:mt-[0px] max-xl:flex max-xl:items-center max-lg:left-0 max-lg:justify-center"
            data-aos="fade-up"
          >
            <Image
              className="h-[780px] max-w-[750px] max-xl16:h-[730px] max-xl16:max-w-[650px] max-xl15:h-[700px] max-xl15:max-w-[620px] max-xl14:h-[650px] max-xl14:max-w-[590px] max-xl:h-[400px] max-xl:max-w-[400px] max-sm:hidden"
              src={mobilepcimg}
              alt="img"
            />
            <Image
              className="hidden max-sm:block"
              src={mobilepcimage}
              alt="img"
            />
            <Image
              className="absolute right-[-30px] top-[50%] translate-y-[-70%] max-xl16:right-0 max-xl16:w-[180px] max-xl:w-[130px] max-xl:translate-y-[-90%] max-lg:hidden"
              src={vectrorlinewithtriangle}
              alt="img"
            />
          </div>
          <div
            className="relative left-[-20px] w-full max-w-[794px] p-[95px_0px_120px] max-xl17:p-[95px_0px_95px] max-xl16:p-[70px_0px_70px] max-lg:left-0 max-lg:mx-auto max-lg:p-[35px_0px] max-sm:p-[25px_0px_0px]"
            data-aos="fade-up"
          >
            <h2 className="text-center text-[43px] font-semibold uppercase leading-normal text-store-white max-xl:text-[36px] max-[420px]:text-[30px]">
              OUR GUARANTEE
            </h2>
            <h4 className="mt-[25px] text-center text-[18px] font-medium leading-[166%] text-store-white max-xl:text-[15px] max-sm:mt-[10px] max-sm:px-[10px] max-sm:text-[18px]">
              WE STAND BEHIND EVERY DEVICE WE SHIP
            </h4>
            <p className="mx-auto mt-[15px] w-full max-w-[579px] text-center text-[18px] font-normal leading-[155%] text-store-white max-xl:text-[15px] max-sm:text-[18px]">
              You’re protected from surprises. Every item is carefully
              inspected, and we ship what we show.
            </p>
            <div className="mt-[30px] grid grid-cols-12 gap-[30px] max-sm:gap-[15px]">
              {items.map((item, index) => (
                <div key={index} className="col-span-6 max-sm:col-span-12">
                  <div className="flex h-full items-start gap-[17px] rounded-[15px] bg-store-bgextralightwhite p-[20px_30px_20px_28px] backdrop-opacity-[.15] max-xl14:p-[20px_20px] max-sm:p-[20px_25px_20px_17px]">
                    <Image className="mt-[2px]" src={item.icon} alt="img" />
                    <div>
                      <h4 className="text-[20px] font-semibold leading-[150%] text-store-white max-xl14:text-[14px] max-xl:text-[16px] max-sm:text-[18px] max-[420px]:text-[15px]">
                        {item.title}
                      </h4>
                      <p className="mt-[13px] text-[18px] font-medium leading-[155%] text-store-white max-xl14:text-[13px] max-xl:text-[15px] max-sm:mt-[10px] max-sm:text-[18px] max-[420px]:text-[14px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-[50px] flex justify-center max-sm:mt-[30px]">
              <Bluebtn
                text="Browse Phones & Laptops Now"
                className="p-[12px_30px] hover:bg-store-white hover:text-store-blue hover:opacity-[1] max-sm:w-full max-sm:p-[12px_20px!important] max-[420px]:p-[12px_10px!important] max-[420px]:text-[14px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guarantee;
