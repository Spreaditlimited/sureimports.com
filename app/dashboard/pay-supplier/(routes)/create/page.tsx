import React from 'react';
import FormPaySupplier from '@/app/dashboard/pay-supplier/components/FormPaySupplier';
import type { Metadata } from 'next';

let titlex = 'Dashboard: Pay Supplier';
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

function PaySupplier() {
  return (
    <div className="mt-8">
      <FormPaySupplier />
    </div>
  );
}

export default PaySupplier;
