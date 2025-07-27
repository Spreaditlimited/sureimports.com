'use client';

import React from 'react';
import SearchPage from './order-table-search';
import TableData from './table-components/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { Input } from '@/components/ui/input-with-dark-mode';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  unitWeight: number;
}

interface MoreOrdersProps {
  products: Product[];
}

function MoreOrders({ products }: MoreOrdersProps) {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="flex flex-col bg-white dark:bg-[#161629]">
      <div className="flex flex-row items-center justify-between p-[25px] max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="text-center text-xl font-bold text-slate-800 dark:text-slate-200">
          {products.length} Products
        </div>
        <div className="flex items-center md:gap-[10px]">
          <div className="text-[13px] font-normal text-slate-500">
            Show entries
          </div>
          <SearchPage />
        </div>
      </div>
      <div>
        <TableData products={products} />
      </div>
      {/* total cost of order */}
      <div className="flex flex-col gap-4 rounded-t-sm border border-slate-200 p-[25px]">
        <div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Total Cost of Order:
          </div>
          <div className="text-base text-slate-600 dark:text-slate-300 lg:flex lg:gap-3">
            <span className="font font-medium text-slate-600">
              ¥423.50 Yuan
            </span>{' '}
            or <span className="font-medium text-slate-600"> $60.50 USD</span>{' '}
            or{' '}
            <span className="font-medium text-slate-600">
              {' '}
              ₦23,292.50 Naira
            </span>
          </div>
        </div>
      </div>
      {/* estimated cost of order */}

      <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
          Estimated Shipping Cost of Order:
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-20 text-base text-slate-950 dark:text-white">
            <p className="w-72">Domestic Shipping Cost within China:</p> $0.10
          </div>
          <div className="flex gap-20 text-base text-slate-950 dark:text-white">
            <p className="w-72">International Shipping Cost:</p> $0.10
          </div>
          <div className="flex gap-4 text-base text-slate-600 dark:text-white">
            <span className="font-semibold">$2.20 USD</span> or{' '}
            <span className="font-semibold">₦1,870.00 Naira</span>
          </div>
        </div>
        {/* important notice */}
        <div>
          <div className="text-sm font-semibold text-red-400">
            Important Notice:
          </div>
          <div className="text-sm font-normal text-red-400">
            If this cost is higher than the actual cost which will be determined
            later at the China office, we will refund you. If the actual cost is
            higher than this estimated cost, you will be required to make a
            balance payment.
          </div>
        </div>
      </div>
      {/* details */}
      <div className="flex flex-col gap-4 border border-slate-200 p-[25px]">
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Estimated Total Weight of Order:</p>{' '}
          <p>0.2 Kg</p>
        </div>
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64"> Shipping Cost:</p>
          <p>China Air Freight</p>
        </div>
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64"> Rate:</p>
          <p>$10.5 (per Kg)</p>
        </div>
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Destination Country:</p>
          <p>Nigeria</p>
        </div>
        <div className="flex max-md:justify-between md:gap-20">
          <p className="md:w-64">Port of Exit:</p>
          <p>HONG KONG</p>
        </div>
      </div>
      <div className="flex items-center gap-4 border border-slate-200 p-[25px]">
        <p className="md:pr-[84px]">Grand total cost:</p>
        <div>
          <span className="text-2xl font-bold text-indigo-800">$99.75 USD</span>{' '}
          Or{' '}
          <span className="text-2xl font-bold text-green-500">
            ₦84,783.25 Naira
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-slate-200 p-[25px] dark:border">
        <p>
          15% Service Charge of{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            $12.60 USD
          </span>{' '}
          inclusive.<span></span>
        </p>
        <p>
          7.5% VAT of{' '}
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            $0.95 USD
          </span>{' '}
          inclusive.
        </p>
        <p>
          Exchange Rate (Naira):
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            {' '}
            $1 USD{' '}
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-500">
            {' '}
            = ₦850 Naira
          </span>
        </p>
      </div>
      {path.includes('pending-orders') ||
      path.includes('approved-orders') ||
      path.includes('in-transit') ||
      path.includes('ready-for-pickup') ||
      path.includes('completed-orders') ? (
        ''
      ) : (
        <div className="flex flex-col justify-between border border-slate-200 p-[25px] max-xl:gap-4 xl:flex-row xl:items-center">
          <div className="flex flex-col items-center text-base text-slate-800 dark:text-slate-200 max-md:items-start max-md:gap-3 lg:items-start">
            <div>
              Agree to{' '}
              <Link href="/terms-and-conditions">
                <span className="text-indigo-800">Terms & Condition</span>
              </Link>
            </div>
            <div className="flex text-sm text-slate-800 dark:text-slate-400 max-md:items-start max-md:gap-3 md:text-center lg:items-center lg:gap-2">
              <Checkbox />
              You must agree to our Terms & Conditions before proceeding
            </div>
          </div>
          <div className="flex flex-col gap-[15px] lg:flex-row">
            <Button className="flex items-center gap-2 bg-slate-400">
              <Image
                loading="lazy"
                src="/icons/bank.svg"
                alt="Logo"
                width={20}
                height={20}
                className="items-center self-center"
              />
              Payment via Paystack
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                router.push('/dashboard/pay-supplier/bank-payment');
              }}
            >
              <Image
                loading="lazy"
                src="/icons/bank.svg"
                alt="Logo"
                width={20}
                height={20}
                className="items-center self-center"
              />
              Bank Deposit & Int’t Payments
            </Button>
          </div>
        </div>
      )}
      {path.includes('pending-orders') ||
      path.includes('approved-orders') ||
      path.includes('in-transit') ||
      path.includes('ready-for-pickup') ||
      path.includes('completed-orders') ? (
        ''
      ) : (
        <div className="flex flex-col justify-between gap-2 border border-slate-200 p-[25px] xl:flex-row xl:items-center">
          <div className="flex flex-col gap-3">
            <div>Your order is Comprehensively Insured.</div>
            <div className="flex">
              <Image
                alt="secure"
                src="/images/secure.png"
                width={90}
                height={36}
              />
              <Image
                alt="secure"
                src="/images/cards.png"
                width={346}
                height={36}
              />
            </div>
          </div>
          <div className="relative flex h-20 justify-end rounded-[14px] border border-dashed border-indigo-800 bg-slate-100 lg:w-[581px]">
            <div className="flex w-full items-center">
              <Image
                loading="lazy"
                src="/icons/cupon.svg"
                alt="Logo"
                width={20}
                height={20}
                className="absolute ml-8"
              />
              <Input
                className="m-[10px] h-[60px] rounded-[10px] bg-white pl-16 max-lg:w-full max-md:pl-12 lg:w-[561px]"
                placeholder="Enter coupon code"
              />
            </div>
            <Button type="submit" className="absolute m-5">
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoreOrders;
