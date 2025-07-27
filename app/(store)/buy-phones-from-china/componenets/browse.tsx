'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import mobile from '@/public/images/mobile.svg';
import laptop from '@/public/images/laptop.svg';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useSearchParams } from 'next/navigation';

interface BrowseItem {
  href: string;
  icon: StaticImageData;
  text: string;
}

const Browse: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const searchParams = useSearchParams();

  const userAffiliateRefx = new URLSearchParams(searchParams).get('affRef');

  const affiliateLink = '/auth/signup-store?affRef=' + userAffiliateRefx;

  const browseItems: BrowseItem[] = [
    {
      href: affiliateLink || '/auth/signup-store',
      icon: mobile,
      text: 'Browse Phones Now',
    },
    {
      href: affiliateLink || '/auth/signup-store',
      icon: laptop,
      text: 'Browse Laptop Now',
    },
  ];

  return (
    <div className="bg-store-lightskyblue py-[120px] max-xl17:py-[60px] max-xl:py-[50px] max-lg:py-[50px]">
      <div className="px-[30px] max-sm:px-[38px] max-[420px]:px-[20px]">
        <div className="fix-width">
          <div className="text-center">
            <h2 className="gradient-text text-[42px] font-semibold leading-[152%] max-lg:text-[36px] max-sm:px-[10px] max-[420px]:text-[30px]">
              Buy Phones & Laptop Now
            </h2>
          </div>
          <div className="mx-auto mt-[52px] flex w-full max-w-[1150px] justify-center gap-[50px] max-lg:gap-[30px] max-md:flex-col max-sm:mt-[40px] max-[420px]:gap-[20px]">
            {browseItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="duration-[0.3s] browse-link inline-flex min-w-[550px] items-center gap-[40px] rounded-[20px] border border-solid border-[#F4F4F4] bg-store-white p-[37px_30px_37px_55px] shadow-customboxshadow transition-all hover:bg-store-blue max-xl:min-w-[430px] max-xl:p-[30px] max-lg:min-w-[350px] max-lg:gap-[25px] max-lg:p-[25px] max-sm:rounded-[15px] max-[420px]:min-w-[260px] max-[420px]:p-[20px_15px]"
              >
                <Image
                  className="max-[420px]:max-w-[17%]"
                  src={item.icon}
                  alt="icon"
                />
                <span className="gradient-text text-[24px] font-semibold leading-[200%] max-lg:text-[22px] max-[420px]:text-[18px]">
                  {item.text}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;
