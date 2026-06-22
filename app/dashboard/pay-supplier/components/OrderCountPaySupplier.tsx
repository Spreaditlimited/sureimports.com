'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useRecord } from '@/app/context/RecordCountPaySupplierContext';

interface ProductStatus {
  params: {
    statusx: string;
  };
}

const OrderCount: React.FC<ProductStatus> = () => {
  const router = useRouter();
  const { recordx } = useRecord();

  const cards = [
    {
      image: '/icons/pay-supplier/bank.svg',
      title: 'Saved Payment Request',
      number: recordx?.savedOrder,
      href: '/dashboard/pay-supplier/saved',
    },
    {
      image: '/icons/pay-supplier/pending.svg',
      title: 'Bank Pending',
      number: recordx?.paymentPendingOrder,
      href: '/dashboard/pay-supplier/pending-payment',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Paid Supplier',
      number: recordx?.paidSupplierOrder,
      href: '/dashboard/pay-supplier/paid-supplier',
    },
    {
      image: '/icons/pay-supplier/paid.svg',
      title: 'Request Cancelled',
      number: recordx?.cancelledOrder,
      href: '/dashboard/pay-supplier/cancelled',
    },
  ];

  return (
    <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <button
          key={card.href}
          type="button"
          className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-slate-800/70 dark:border-slate-700 dark:bg-[#161629]/70 dark:hover:bg-[#1d1f36]"
          onClick={() => {
            router.push(card.href);
          }}
        >
          <div className="rounded-lg bg-slate-800 p-3 dark:bg-[#0f1020]">
            <Image src={card.image} alt={card.title} width={26} height={26} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {card.number ?? 0}
            </div>
            <div className="text-sm font-medium text-slate-400">
              {card.title}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OrderCount;
