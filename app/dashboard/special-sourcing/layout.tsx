'use client';
import { Button } from '@/components/ui/button';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Payments from '@/content/payments.json';
import { cn } from '@/_lib/utils';
import { OrderCountProvider } from '@/app/context/OrderCountContext';
//import { RecordCountSpecialSourcingProvider } from '@/app/context/CountRecordsSpecialSourcingContext';
import OrderCount from './components/OrderCountSpecialSourcing';
import { RecordCountSpecialSourcingProvider } from '@/app/context/RecordCountContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRecord } from '@/app/context/RecordCountContext';

type UserLayoutProps = {
  children: React.ReactNode;
};

function PaySupplier(props: UserLayoutProps) {
  const router = useRouter();
  const path = usePathname();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-800">
      <div className="p-4 dark:bg-black">
        <div className="flex justify-between max-sm:flex-col">
          <div
            className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4"
            onClick={() => {
              router.push('/dashboard/special-sourcing/create');
            }}
          >
            Special Sourcing
          </div>
          <Button
            className="font-medium xl:h-[49px] xl:w-[255px]"
            onClick={() => {
              router.push('/dashboard/special-sourcing/create');
            }}
          >
            Request Special Sourcing
          </Button>
        </div>

        <div className="mt-[7px] items-start justify-center gap-2 rounded-xl bg-white p-2 py-[10px] text-base font-normal text-slate-600 dark:bg-black dark:text-white max-sm:pl-4 md:flex-row">
          We guarantee the <b>accuracy</b> and <b>quality</b> of every product
          we source for you from China.
        </div>
      </div>
      <main>
        <RecordCountSpecialSourcingProvider>
          <OrderCount params={{ statusx: 'saved' }} />
          {props.children}
        </RecordCountSpecialSourcingProvider>
      </main>
    </div>
  );
}

export default PaySupplier;
