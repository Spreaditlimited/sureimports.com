import AddProductModal from '@/app/dashboard/procurement/add-product/components/add-product-modal';
import React from 'react';
import type { Metadata } from 'next';

let titlex = 'Dashboard: General Procurement';
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

function AddProduct() {
  return (
    <div className="bg-slate-100 dark:bg-slate-800">
      <div className="flex flex-col pl-6 pt-6 text-[28px] font-bold text-slate-800 dark:text-white lg:flex-row lg:items-center lg:gap-3">
        Add product
        <span className="text-base font-normal text-slate-800 dark:text-slate-400">
          (Procurement & Shipping)
        </span>
      </div>
      <div className="m-6 rounded-xl bg-white dark:bg-[#161629]">
        <div>{/* <AddProductModal /> */}</div>
      </div>
    </div>
  );
}

export default AddProduct;
