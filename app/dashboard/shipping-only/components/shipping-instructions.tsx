import React from 'react';
import Image from 'next/image';

function ShippingInstructions() {
  return (
    <div className="relative flex justify-center md:w-full xl:h-[920px] xl:w-[567px]">
      <div className="my-3 h-96 w-80 rounded-[10px] max-xl:w-full max-md:w-96 max-sm:h-[550px] lg:ml-2 xl:absolute xl:w-[527px] xl:pt-64">
        <div className="flex flex-col gap-3">
          <div className="light:border-slate-100 flex gap-10 rounded-[10px] border bg-slate-50 pl-4 dark:bg-[#161629] max-xl:w-full max-xl:py-3 xl:h-[115px] xl:w-[527px] xl:gap-2 xl:pt-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-800/10">
              <Image
                src="/icons/specialsourcing/location2.svg"
                alt="Paystack"
                width={27}
                height={27}
              />
            </div>
            <div className="flexx flex-col flex-wrap">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 md:text-base">
                China address in English
              </div>
              <div className="text-sm font-normal text-slate-600 max-md:w-56 md:text-base lg:w-[430px]">
                Room 323 3/F Mingsheng Business Centre 12-20 Guangyang road, M.
                Baiyun District, Guangzhou, China.
              </div>
            </div>
          </div>
          <div className="light:border-slate-100 flex items-center gap-5 rounded-[10px] border bg-slate-50 pl-4 dark:bg-[#161629] max-xl:w-full max-xl:py-3 xl:h-[115px] xl:w-[527px] xl:gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-400/10">
              <Image
                src="/icons/specialsourcing/location.svg"
                alt="Paystack"
                width={27}
                height={27}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 md:text-base">
                China address in Chinese
              </div>
              <div className="flex w-[419px] flex-wrap text-sm font-normal text-slate-600 max-md:w-56 md:text-base">
                广州市白云区广源中路18号明圣商贸城明圣商贸城323档
              </div>
            </div>
          </div>
          <div className="light:border-slate-100 flex items-center gap-5 rounded-[10px] border bg-slate-50 pl-4 dark:bg-[#161629] max-xl:w-full max-xl:py-3 xl:h-[115px] xl:w-[527px] xl:gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-400">
              <Image
                src="/icons/specialsourcing/phone.svg"
                alt="Paystack"
                width={27}
                height={27}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 md:text-base">
                Phone No.
              </div>
              <div className="w-[419px] text-sm font-normal text-slate-600 max-md:w-56 md:text-base">
                +86 195 7683 7849
              </div>
            </div>
          </div>
          <div className="light:border-slate-100 flex items-center gap-5 rounded-[10px] border bg-slate-50 pl-4 dark:bg-[#161629] max-xl:w-full max-xl:py-3 xl:h-[115px] xl:w-[527px] xl:gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-400">
              <Image
                src="/icons/specialsourcing/phone.svg"
                alt="Paystack"
                width={27}
                height={27}
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 md:text-base">
                Contact Name
              </div>
              <div className="w-[419px] text-sm font-normal text-slate-600 max-md:w-56 md:text-base">
                Emmanuel
              </div>
            </div>
          </div>
          <div className="light:border-slate-100 flex flex-col flex-wrap gap-[20px] rounded-[10px] border bg-slate-50 p-2 pl-[20px] pt-[20px] text-sm font-normal leading-normal text-slate-600 dark:bg-[#161629] dark:text-slate-400 max-xl:w-full max-xl:pb-4 lg:text-base xl:h-[110px] xl:w-[527px]">
            <div>
              Kindly note that you are responsible for making sure your supplier
              sends your goods to us and that your goods actually get to us.
            </div>
          </div>
        </div>
      </div>
      <div className="h-full max-xl:hidden">
        <Image
          src="/images/special-sourcing.png"
          alt="Special Sourcing Instructions"
          width={1500}
          height={900}
          className="h-full w-full rounded-md object-cover max-sm:hidden"
        />
      </div>
    </div>
  );
}

export default ShippingInstructions;
