import React from 'react';
import VerifySupplierForm from '@/app/dashboard/verify-supplier/components/FormVerifySupplier';
import type { Metadata } from 'next';

let titlex = 'Dashboard: Verify Supplier';
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

function VerifySupplier() {
  return (
    <div className="h-full">
      <div className="p-[25px]">
        <div className="text-[28px] font-bold text-slate-800 dark:text-white max-sm:pb-4">
          Request to Verify a Supplier
        </div>
        <div className="text-base font-normal text-slate-600 dark:text-slate-300 xl:w-[930px]">
          Provide the details of the supplier you wish to do business with. We
          will physically verify the supplier and send you an email within 3
          business days.
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-slate-50 px-4 dark:bg-slate-800 lg:flex-row xl:items-start">
        <div className="w-full">
          <VerifySupplierForm />
        </div>
        <div>{/* <SpecialInstructions /> */}</div>
      </div>
    </div>
  );
}

export default VerifySupplier;
