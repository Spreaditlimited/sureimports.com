import React from 'react';

import ShippingOnlyForm from '@/app/dashboard/shipping-only/components/shipping-sourcing-form';
import ShippingInstructions from '@/app/dashboard/shipping-only/components/shipping-instructions';
import type { Metadata } from 'next';

let titlex = 'Dashboard: Shipping Only';
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

function ShippingOnly() {
  return (
    <div className="w-full max-xl:mb-16 max-sm:mb-0 max-sm:min-h-screen">
      <div className="p-[25px]">
        <div className="text-[28px] font-bold text-slate-800 dark:text-white max-sm:pb-4">
          Shipping Only
        </div>
        <div className="text-base font-normal text-slate-600 dark:text-slate-300 xl:w-[930px]">
          Instruct your supplier to send your shipment to us and ensure that
          each shipment is labelled with your name and destination country.
        </div>
      </div>
      <div className="flex w-full flex-col bg-slate-50 px-4 dark:bg-slate-800 xl:flex-row xl:items-start">
        <div className="w-full">
          <ShippingOnlyForm />
        </div>
        <div>
          <ShippingInstructions />
        </div>
      </div>
    </div>
  );
}

export default ShippingOnly;
