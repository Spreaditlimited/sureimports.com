import React from 'react';
import Process from '@/components/dashboard/buy-phone/process';
import FormPhone from '@/components/dashboard/buy-phone/formPhone';
import type { Metadata } from 'next';

let titlex = 'Dashboard: Buy Phones';
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

function BuyPhone() {
  return (
    <div className="bg-slate-50 px-4 py-[25px] text-slate-800 dark:bg-slate-900 dark:text-white">
      <div className="flex justify-between max-sm:flex-col">
        <div className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4">
          Buy Phones
        </div>
      </div>
      <Process />
      <FormPhone />
    </div>
  );
}

export default BuyPhone;
