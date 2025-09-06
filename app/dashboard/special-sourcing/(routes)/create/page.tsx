import React from 'react';
import SpecialSourcingForm from './../../components/FormSpecialSourcing';
// import SpecialInstructions from './components/special-instructions';
import type { Metadata } from 'next';

let titlex = 'Dashboard: Special Sourcing';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

function SpecialSourcing() {
  return (
    <div className="h-full dark:bg-black">
      <div className="p-[25px] dark:bg-black">
        <div className="text-[28px] font-bold text-slate-800 dark:text-white max-sm:pb-4">
          Request for Special Sourcing
        </div>
        <div className="bg:text-slate-400 text-base font-normal dark:text-slate-400 xl:w-[930px]">
          Just tell us what you want to buy from China, pay a refundable product
          sourcing commitment fee, and we get started. We will refund you when
          you go ahead with the order.{' '}
        </div>
      </div>
      <div className="bg-slate-50x flex w-full flex-col items-center bg-[#ffffff] px-4  dark:bg-black lg:flex-row xl:items-start">
        <div className="w-full">
          <SpecialSourcingForm />
        </div>
        <div>{/* <SpecialInstructions /> */}</div>
      </div>
    </div>
  );
}

export default SpecialSourcing;
