'use client';

import React, { useEffect, useState } from 'react';
//import { useAuthProductCount } from '@/app/context/OrderCountContext';
import Loader from '@/components/uix/Loader';
import { useAuth } from '@/app/context/AuthContext';
import { useRecord } from '@/app/context/RecordCountShippingOnlyContext';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/_lib/utils';

//USER DATA
interface User {
  pidUser: string;
  email: string;
  name: string;
}

//API RESPONSE
interface ApiResponse {
  responsex: any;
  successx: boolean;
  userx: User;
}

//API RESPONSE PRODUCT COUNT
interface ProductCount {
  responsex: any;
  successx: boolean;
  userx: User;
}

interface productStatus {
  params: {
    statusx: string;
  };
}

const OrderCount: React.FC<productStatus> = ({ params }) => {
  const { statusx } = params; // Extracting the 'id' param from URL

  const router = useRouter();
  const path = usePathname();

  //USER DATA
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const { recordx } = useRecord();
  const totalOrders =
    (recordx?.requestReceivedOrder || 0) +
    (recordx?.productShippedOrder || 0) +
    (recordx?.productArrivedOrder || 0) +
    (recordx?.invoicedOrder || 0) +
    (recordx?.paidOrder || 0) +
    (recordx?.productDeliveredOrder || 0) +
    (recordx?.cancelledRequestOrder || 0);

  const cards = [
    {
      image: '/icons/pay-supplier/bank.svg',
      title: 'All',
      number: totalOrders,
      href: '/dashboard/shipping-only/all',
    },
    {
      image: '/icons/pay-supplier/bank.svg',
      title: 'Request Received',
      number: recordx?.requestReceivedOrder,
      href: '/dashboard/shipping-only/request-received',
    },
    {
      image: '/icons/pay-supplier/pending.svg',
      title: 'Shipped',
      number: recordx?.productShippedOrder,
      href: '/dashboard/shipping-only/product-shipped',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Arrived',
      number: recordx?.productArrivedOrder,
      href: '/dashboard/shipping-only/product-arrived',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Invoiced',
      number: recordx?.invoicedOrder,
      href: '/dashboard/shipping-only/invoiced',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Paid',
      number: recordx?.paidOrder,
      href: '/dashboard/shipping-only/paid',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Completed',
      number: recordx?.productDeliveredOrder,
      href: '/dashboard/shipping-only/product-delivered',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Request Cancelled',
      number: recordx?.cancelledRequestOrder,
      href: '/dashboard/shipping-only/request-cancelled',
    },
  ];

  return (
    <>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#161629] sm:p-5">
        <div className="grid w-full justify-between gap-3 md:grid-cols-2 xl:flex">
          {cards.map((card, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center rounded-xl border border-slate-100 bg-slate-50 transition hover:cursor-pointer hover:border-slate-200 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600 xl:w-full',
                path.includes(card.href) && 'border-blue-200 shadow-md dark:border-blue-700/40',
              )}
              onClick={() => {
                router.push(card.href);
              }}
            >
              <div className="m-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={26}
                  height={26}
                  className="m-[14px]"
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600 dark:text-slate-200">
                  {card.number}
                </div>
                <div className="text-sm font-normal text-slate-600 dark:text-slate-400">
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrderCount;
