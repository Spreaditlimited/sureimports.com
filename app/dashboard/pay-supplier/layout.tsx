'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { useRouter } from 'next/navigation';
import OrderCount from '@/app/dashboard/pay-supplier/components/OrderCountPaySupplier';
import { RecordCountPaySupplierProvider } from '@/app/context/RecordCountPaySupplierContext';
import { Plus, RefreshCcw } from 'lucide-react';

type UserLayoutProps = {
  children: React.ReactNode;
};

function PaySupplier(props: UserLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <RecordCountPaySupplierProvider>
        <div className="bg-slate-900 pb-32 pt-12 text-white dark:bg-[#0b0c16]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Pay Supplier
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Pay suppliers in China from your Naira balance. Submit payment
                  details, upload the invoice, and track the request from your
                  dashboard.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-[#161629] dark:hover:bg-[#1d1f36]"
                  onClick={() => router.refresh()}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Sync
                </Button>
                <Button
                  type="button"
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 dark:shadow-blue-950/40"
                  onClick={() => {
                    router.push('/dashboard/pay-supplier/create');
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Pay Supplier
                </Button>
              </div>
            </div>

            <OrderCount params={{ statusx: 'saved' }} />
          </div>
        </div>

        <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {props.children}
        </main>
      </RecordCountPaySupplierProvider>
    </div>
  );
}

export default PaySupplier;
