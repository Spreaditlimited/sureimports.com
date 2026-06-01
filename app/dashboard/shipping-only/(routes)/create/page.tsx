import React from 'react';
import type { Metadata } from 'next';
import { Truck } from 'lucide-react';

import ShippingOnlyForm from '@/app/dashboard/shipping-only/components/shipping-sourcing-form';
import ShippingInstructions from '@/app/dashboard/shipping-only/components/shipping-instructions';

const titlex = 'Create Shipping Request | Sure Imports';
const descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source and ship for you from China.';

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

export default function CreateShippingOnlyPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-12 dark:bg-black sm:pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                Request Shipping Service
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Submit your shipment details and send your products to our China warehouse.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-hidden">
          <div className="grid w-full grid-cols-1 items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <ShippingOnlyForm />
            </div>

            <div className="min-w-0 xl:sticky xl:top-8">
              <ShippingInstructions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
