'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import testimonial1 from '@/public/images/testimonial1.jpg';
import testimonial2 from '@/public/images/testimonial2.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';
const Testimonial = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <section className="p-[120px_0px_60px] max-xl17:p-[50px_0px_50px] max-xl:p-[40px_0px_40px] max-lg:p-[30px_0px_30px] max-sm:p-[50px_0px_25px]">
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <h3
            data-aos="fade-up"
            className="gradient-text text-center text-[42px] font-semibold capitalize leading-none text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[36px]"
          >
            Testimonial
          </h3>
          <div className="mt-7 md:mt-12">
            <div
              data-aos="fade-up"
              className="flex items-stretch gap-[30px] max-md:flex-col"
            >
              <div className="inline-flex flex-1 flex-col justify-between rounded-[30px] bg-buy-sourcing-lightskyblue p-[30px_20px] max-[389px]:p-[30px_15px] md:p-[30px]">
                <div className="flex flex-col gap-[15px] max-sm:text-center">
                  <p className="text-base font-normal text-buy-sourcing-black max-[389px]:text-sm">
                    Working with Sure Imports was a game-changer for our
                    business. We needed 2,000 custom-branded items to fulfill a
                    client order, and all we provided was a product description,
                    branding requirements, and a reference image. The results
                    exceeded our expectations - the product quality and branding
                    were impeccable, matching exactly what we envisioned.
                  </p>
                  <p className="text-base font-normal text-black max-[389px]:text-sm">
                    What truly sets Sure Imports apart is their integrity. Not
                    only did they deliver exceptional quality, but their
                    transparent pricing actually came in below what we thought
                    the final cost will be. Their team handles your sourcing
                    needs with the same care and attention they&apos;d give
                    their own business. For anyone looking for reliable product
                    sourcing from China, I can&apos;t recommend Sure Imports
                    highly enough
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-3 md:mt-10 md:gap-6">
                  <Image
                    src={testimonial1}
                    alt="icon"
                    className="size-[68px] rounded-full object-cover max-[420px]:size-11 md:size-20"
                  />
                  <div className="">
                    <p className="s14:text-[22px] mb-[10px] text-start text-lg font-semibold capitalize leading-tight text-buy-sourcing-black max-[420px]:text-base max-[389px]:mb-[6px] md:mb-4 md:text-xl">
                      Chukwuedozie Nwokoye{' '}
                    </p>
                    <span className="text-gray text-base font-medium capitalize leading-none max-[420px]:text-sm xl:text-lg">
                      {' '}
                      - Nigeria
                    </span>
                  </div>
                </div>
              </div>
              <div className="inline-flex flex-1 flex-col justify-between rounded-[30px] bg-buy-sourcing-lightskyblue p-[30px_20px] max-[389px]:p-[30px_15px] md:p-[30px]">
                <div className="flex flex-col gap-[15px] max-sm:text-center">
                  <p className="text-base font-normal text-buy-sourcing-black max-[389px]:text-sm">
                    Dear Sure Importers Limited,
                  </p>
                  <p className="text-base font-normal text-buy-sourcing-black max-[389px]:text-sm">
                    I just wanted to take a moment to express my sincere
                    appreciation for the excellent service you provided with my
                    recent shipment. From the moment I placed the order to the
                    delivery, everything was handled with the utmost
                    professionalism and efficiency.
                  </p>
                  <p className="text-base font-normal text-black max-[389px]:text-sm">
                    The package arrived on time and in perfect condition, which
                    I greatly appreciate. It’s clear that your team takes great
                    care in ensuring that each order is processed and delivered
                    with precision. I’m truly impressed with the level of
                    attention to detail and the smoothness of the entire
                    process.
                  </p>
                  <p className="text-base font-normal text-black max-[389px]:text-sm">
                    Thank you once again for your outstanding service. It’s
                    always a pleasure to do business with a company that values
                    its customers and goes above and beyond to deliver. I look
                    forward to continuing to shop with you in the future.”
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-3 md:mt-10 md:gap-6">
                  <Image
                    src={testimonial2}
                    alt="icon"
                    className="size-[68px] rounded-full object-cover max-[420px]:size-11 md:size-20"
                  />
                  <div className="">
                    <p className="s14:text-[22px] mb-[10px] text-start text-lg font-semibold capitalize leading-tight text-buy-sourcing-black max-[420px]:text-base max-[389px]:mb-[6px] md:mb-4 md:text-xl">
                      Amarachi Ndukauba Ogbuagu
                    </p>
                    <span className="text-gray text-base font-medium capitalize leading-none max-[420px]:text-sm xl:text-lg">
                      {' '}
                      - Canada
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
