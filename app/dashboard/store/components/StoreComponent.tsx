'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import { useRouter } from 'next/navigation';
import type { Metadata } from 'next';
import { Laptop, Phone, Tag, VideoIcon } from 'lucide-react';
import { useModal } from '@/app/context/ModalContext';
import { useAuth } from '@/lib/AuthContext';
import ProductsList from './ProductsList';
import { BiMobile } from 'react-icons/bi';

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

//const DashBoard = async ({product:any}) => {
function Procurement({ products, categories, brands, id, id2 }: any) {
  const { user } = useAuth();
  const router = useRouter();
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <div className="bg-slate-100 px-4 py-[25px] text-slate-800 dark:bg-slate-900 dark:text-white">
        {/* 
        <div className="flex flex-col gap-[8px] xl:w-[704px]">
          <div className="text-[22px] font-bold capitalize text-slate-800 dark:text-white">
            Buy Phones and Laptops
          </div>
        </div>

        <p className="p-5 text-base text-slate-800 dark:text-white">
          Every phone from Sure Imports comes sealed in its original box,
          complete with all accessories, and includes a one-year warranty for
          your peace of mind. Laptops are pre-owned and come with a bag and
          charger and a 3-month warranty.
        </p> 
        */}

        <div className="flex flex-col gap-[25px]">
          <div className="flex flex-col justify-start xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-3 pt-3 md:flex-row xl:pt-0">
              {categories.map((category: any) => (
                <Button
                  onClick={() => {
                    router.push(
                      '/dashboard/store/?id=' + category['productCategory'],
                    );
                  }}
                  className={
                    'hover:text-w inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl px-4 py-[15px] text-gray-800 dark:bg-slate-300 dark:text-gray-800 md:px-[50px]' +
                    (id == category['productCategory']
                      ? 'bg-indigo-800 text-white dark:bg-indigo-800 dark:text-gray-300'
                      : ' bg-slate-200 hover:text-white dark:bg-gray-600 dark:text-gray-300')
                  }

                  //className="inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl bg-white py-[15px] text-base text-slate-600 hover:bg-[#161629]/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:px-[30px] xl:w-[201px]"
                >
                  {category['productCategory'].toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* BRANDS */}
          <div className="justify-centerx flex w-full">
            <div className="flex items-start gap-3 pt-3 md:flex-row xl:pt-0">
              {brands.map((brand: any) => (
                <Button
                  onClick={() => {
                    router.push(
                      '/dashboard/store/?id=' +
                        id +
                        '&id2=' +
                        brand['productBrand'],
                    );
                  }}
                  className={
                    'hover:text-w inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl px-4 py-[15px] text-gray-800 dark:bg-slate-300 dark:text-gray-800 md:px-[50px]' +
                    (id2 == brand['productBrand']
                      ? 'bg-indigo-800 text-white dark:bg-indigo-800 dark:text-gray-300'
                      : ' bg-slate-200 hover:text-white dark:bg-gray-600 dark:text-gray-300')
                  }
                  //className="m-1 inline-flex h-[15px] items-center justify-center gap-1 rounded-xl bg-white p-[5px] py-[10px] text-xs text-slate-800 hover:bg-[#161629]/10 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 md:px-[30px] xl:w-[201px]"
                  //className="inline-flex h-[30px] items-center justify-center gap-2.5 rounded-xl bg-white py-[15px] text-base text-slate-600 hover:bg-[#161629]/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:px-[30px] xl:w-[201px]"
                  //className="inline-flex h-[49px] items-center justify-center gap-2.5 rounded-xl bg-white py-[15px] text-base text-slate-600 hover:bg-[#161629]/10 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 md:px-[30px] xl:w-[201px]"
                >
                  {/* <Laptop />  */}
                  {brand['productBrand'].toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <ProductsList products={products} />
      </div>
    </>
  );
}

export default Procurement;
