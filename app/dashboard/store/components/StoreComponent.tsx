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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
      <div className="bg-slate-100 px-4 py-[25px] text-slate-800 dark:bg-black dark:text-white">
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
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-start">
            {/* Category Filter */}
            <div className="w-full md:w-[28rem]">
              <div className="flex w-full items-center gap-3">
                <span
                  id="category-label"
                  className="whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Product Category
                </span>
                <Select
                  value={id || undefined}
                  onValueChange={(value) => {
                    if (!value || value === 'all') {
                      router.push('/dashboard/store');
                    } else {
                      router.push('/dashboard/store/?id=' + encodeURIComponent(value));
                    }
                  }}
                >
                  <SelectTrigger
                    aria-label="Filter by category"
                    aria-labelledby="category-label"
                    className="h-[49px] w-full rounded-xl border border-slate-300 bg-slate-200 text-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-indigo-400"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category: any) => {
                      const value = category['productCategory'];
                      return (
                        <SelectItem key={value} value={value}>
                          {String(value).toUpperCase()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="w-full md:w-[28rem]">
              <div className="flex w-full items-center gap-3">
                <span
                  id="brand-label"
                  className="whitespace-nowrap text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Product Brand
                </span>
                <Select
                  disabled={!id}
                  value={id2 || undefined}
                  onValueChange={(value) => {
                    if (!id) {
                      if (!value || value === 'all') router.push('/dashboard/store');
                      else router.push('/dashboard/store/?id2=' + encodeURIComponent(value));
                      return;
                    }

                    if (!value || value === 'all') {
                      router.push('/dashboard/store/?id=' + encodeURIComponent(id));
                    } else {
                      router.push(
                        '/dashboard/store/?id=' +
                          encodeURIComponent(id) +
                          '&id2=' +
                          encodeURIComponent(value),
                      );
                    }
                  }}
                >
                  <SelectTrigger
                    aria-label="Filter by brand"
                    aria-labelledby="brand-label"
                    className="h-[49px] w-full rounded-xl border border-slate-300 bg-slate-200 text-gray-800 data-[disabled=true]:opacity-60 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus-visible:ring-indigo-400"
                  >
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand: any) => {
                      const value = brand['productBrand'];
                      return (
                        <SelectItem key={value} value={value}>
                          {String(value).toUpperCase()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <ProductsList products={products} />
      </div>
    </>
  );
}

export default Procurement;
