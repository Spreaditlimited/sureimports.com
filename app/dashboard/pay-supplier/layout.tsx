'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Payments from '@/content/payments.json';
import { cn } from '@/_lib/utils';
import { OrderCountProvider } from '@/app/context/OrderCountContext';
//import { RecordCountSpecialSourcingProvider } from '@/app/context/CountRecordsSpecialSourcingContext';
import OrderCount from '@/app/dashboard/pay-supplier/components/OrderCountPaySupplier';
import { RecordCountPaySupplierProvider } from '@/app/context/RecordCountPaySupplierContext';
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
      <div className="p-4">
        <div className="flex justify-between max-sm:flex-col">
          <div
            className="text-[28px] font-bold text-slate-800 dark:text-slate-200 max-sm:pb-4"
            onClick={() => {
              router.push('/dashboard/pay-supplier/create');
            }}
          >
            Pay Supplier
          </div>
          <Button
            className="font-medium xl:h-[49px] xl:w-[255px]"
            onClick={() => {
              router.push('/dashboard/pay-supplier/create');
            }}
          >
            Pay Supplier
          </Button>
        </div>

        <div className="mt-[20px] items-start justify-center gap-2 rounded-xl bg-white p-5 py-[15px] text-base font-normal text-slate-600 dark:bg-[#161629] dark:text-white max-sm:pl-4 md:flex-row">
          Give us <span className="font-semibold">Naira</span> & get{' '}
          <span className="font-semibold">Yuan</span> in China within{' '}
          <span className="font-semibold">24hours</span> - You or your Supplier.
        </div>
      </div>
      <main>
        <RecordCountPaySupplierProvider>
          <OrderCount params={{ statusx: 'saved' }} />
          {props.children}
        </RecordCountPaySupplierProvider>
      </main>
    </div>
  );
}

export default PaySupplier;
