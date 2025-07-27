import React from 'react';
import Image from 'next/image';
import client from '@/public/images/client.jpg';
import clientMobileImg from '@/public/images/clientMobileImg.jpg';

const Card = () => {
  return (
    <>
      <div className="px-[30px] max-sm:px-[20px]">
        <div className="fix-width">
          <h4
            data-aos="fade-up"
            className="gradient-text mb-[30px] text-center text-[42px] font-semibold capitalize leading-tight text-buy-sourcing-white max-xl:text-[26px] max-sm:text-[36px] max-[420px]:text-[30px] lg:mb-12"
          >
            Sleep with Two Eyes Closed
          </h4>
          <div data-aos="fade-up">
            <div className="s15:gap-[60px] flex items-stretch gap-5 rounded-[30px] bg-[#F1F5F9] p-5 max-lg:flex-col lg:gap-9">
              <div className="relative h-full sm:mx-auto sm:h-80 sm:w-80 lg:h-full lg:w-72 xl:h-[360px] xl:w-[348px]">
                <Image
                  src={client}
                  alt="Testimonial"
                  className="hidden h-full w-full rounded-[20px] object-cover max-md:object-top sm:block md:rounded-[30px]"
                />
                <Image
                  src={clientMobileImg}
                  alt="Testimonial"
                  className="mx-auto block h-full w-full max-w-[350px] rounded-[20px] object-cover max-md:object-top sm:hidden md:rounded-[30px]"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center max-lg:text-center xl:pr-8 xl14:pr-24 xl15:pr-32 xl16:pr-44 xl17:pr-44">
                <p className="text-base font-normal leading-relaxed text-black max-sm:px-2 md:text-lg">
                  You want to import equipment? You want to source anything in
                  China? You are so afraid of being defrauded? You just want an
                  honest upright truthful sensible person. You want a person who
                  will listen and execute every line of the agreement. You want
                  a person who is deeply knowledgeable and not audio. You want a
                  person whose integrity allows you pay him N100 million and go
                  to sleep. You want a person who has a team (not audio) in
                  China. You want a person with a brain who can make suggestions
                  and guide you. Nwannem, run to Nkwocha Tochukwu (CEO of Sure
                  Importers Limited). Pay him your money. Buy popcorn, cross leg
                  and chop. Sleep with 2 eyes closed. Kobo no go miss.
                </p>
                <div className="mt-4 md:mt-6 lg:mt-8">
                  <h2 className="mb-[10px] text-lg font-semibold capitalize leading-none text-buy-sourcing-black md:mb-[15px] md:text-[22px]">
                    Chioma Ifeanyi-Eze
                  </h2>
                  <span className="text-gray mt-2 text-base font-medium capitalize md:text-lg">
                    - Nigeria
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
