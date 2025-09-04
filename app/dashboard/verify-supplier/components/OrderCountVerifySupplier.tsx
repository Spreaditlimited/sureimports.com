'use client';

import React, { useEffect, useState } from 'react';
//import { useAuthProductCount } from '@/app/context/OrderCountContext';
import Loader from '@/components/uix/Loader';
import { useAuth } from '@/app/context/AuthContext';
import { useRecord } from '@/app/context/RecordCountVerifySupplierContext';
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

  const cards = [
    {
      image: '/icons/pay-supplier/bank.svg',
      title: 'Payment Pending',
      number: recordx?.pendingPaymentOrder,
      href: '/dashboard/verify-supplier/pending-payment',
    },
    {
      image: '/icons/pay-supplier/pending.svg',
      title: 'Processing Request',
      number: recordx?.processingRequestOrder,
      href: '/dashboard/verify-supplier/processing-request',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Request Processed',
      number: recordx?.requestProcessedOrder,
      href: '/dashboard/verify-supplier/request-processed',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Request Cancelled',
      number: recordx?.cancelledOrder,
      href: '/dashboard/verify-supplier/cancelled',
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col items-center bg-slate-50 px-4 dark:bg-black xl:flex-row xl:items-start">
        <div className="my-[20px] grid w-full justify-between gap-3 max-sm:justify-center md:grid-cols-2 xl:flex">
          {cards.map((card, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center rounded-xl bg-white hover:cursor-pointer dark:bg-[#161629] max-sm:w-[380px] xl:w-full',
                path.includes(card.href) && 'border shadow-md',
              )}
              onClick={() => {
                router.push(card.href);
              }}
            >
              <div className="m-3 rounded-lg bg-slate-100 dark:bg-black">
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
