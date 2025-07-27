'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Payments from '@/content/payments.json';
import { cn } from '@/_lib/utils';

const cards = [
  {
    image: '/icons/pay-supplier/card.svg',
    title: 'Saved Payment Request',
    number: Payments.SavedPayments.length,
    href: '/dashboard/pay-supplier/saved-payment-request',
  },
  {
    image: '/icons/pay-supplier/bank.svg',
    title: 'Bank Pending',
    number: Payments.BankPending.length,
    href: '/dashboard/pay-supplier/bank-pending',
  },
  {
    image: '/icons/pay-supplier/pending.svg',
    title: 'Pending Request (Paid)',
    number: Payments.PendingRequest.length,
    href: '/dashboard/pay-supplier/pending-request',
  },
  {
    image: '/icons/pay-supplier/paid.svg',
    title: 'Paid Supplier (Completed)',
    number: Payments.PaidSupplier.length,
    href: '/dashboard/pay-supplier/paid-supplier',
  },
];

type UserLayoutProps = {
  children: React.ReactNode;
};

function PaySupplier(props: UserLayoutProps) {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800">
      <div className="p-4">
        <div className="flex justify-between max-sm:flex-col">
          <div
            className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4"
            onClick={() => {
              router.push('/dashboard/pay-supplier/bank-payment');
            }}
          >
            Pay Supplier
          </div>
          <Button
            className="font-medium xl:h-[49px] xl:w-[255px]"
            onClick={() => {
              router.push('/dashboard/pay-supplier/create-payment-request');
            }}
          >
            Create Payment Request
          </Button>
        </div>
        <div className="mt-[20px] flex flex-col items-start justify-center gap-2 rounded-xl bg-white py-[15px] text-base font-normal text-slate-600 dark:bg-[#161629] dark:text-white max-sm:pl-4 md:flex-row">
          <div>
            Give us <span className="font-semibold">Naira</span> & get{' '}
            <span className="font-semibold">Yuan</span>
          </div>{' '}
          <div>
            in China within <span className="font-semibold">24hours</span>
          </div>
          - You or your Supplier.
        </div>
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
      <main>{props.children}</main>
    </div>
  );
}

export default PaySupplier;
