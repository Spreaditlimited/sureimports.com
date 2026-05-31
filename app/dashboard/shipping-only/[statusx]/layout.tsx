'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, ArrowLeft, RefreshCcw, Layers, Clock, CheckCircle2 } from 'lucide-react';

import { RecordCountShippingOnlyProvider } from '@/app/context/RecordCountShippingOnlyContext';
import { useRecord } from '@/app/context/RecordCountShippingOnlyContext';

type ShippingOnlyLayoutProps = {
  children: React.ReactNode;
};

function ShippingOnlyTopHeader() {
  const router = useRouter();
  const { recordx } = useRecord();

  const totalProjects =
    (recordx?.requestReceivedOrder || 0) +
    (recordx?.productShippedOrder || 0) +
    (recordx?.productArrivedOrder || 0) +
    (recordx?.invoicedOrder || 0) +
    (recordx?.paidOrder || 0) +
    (recordx?.productDeliveredOrder || 0);

  const inProgress =
    (recordx?.productShippedOrder || 0) +
    (recordx?.productArrivedOrder || 0) +
    (recordx?.invoicedOrder || 0) +
    (recordx?.paidOrder || 0);

  const completed = recordx?.productDeliveredOrder || 0;

  const stats = [
    { label: 'Total Projects', count: totalProjects, icon: Layers, color: 'text-blue-400' },
    { label: 'In Progress', count: inProgress, icon: Clock, color: 'text-amber-400' },
    { label: 'Completed', count: completed, icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipping Only</h1>
          <p className="mt-2 text-slate-400">
            Manage your self-procured shipments in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.refresh()}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium transition hover:bg-slate-700 dark:bg-[#161629] dark:hover:bg-[#1d1f36]"
          >
            <RefreshCcw className="h-4 w-4" />
            Sync
          </button>
          <Link href="/dashboard/shipping-only/create">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold transition hover:bg-blue-500 shadow-lg shadow-blue-900/20 dark:shadow-blue-950/40">
              <Plus className="h-4 w-4" />
              New Request
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl border border-slate-700 bg-slate-800/50 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-[#161629]/70"
          >
            <div className={`rounded-lg bg-slate-800 p-3 dark:bg-[#0f1020] ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-end gap-2 text-sm text-slate-400">
        <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />
        <span>Live Updates</span>
      </div>
    </>
  );
}

export default function ShippingOnlyLayout({ children }: ShippingOnlyLayoutProps) {
  const path = usePathname();
  const isCreatePage = path.includes('/create');

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-black">
      <RecordCountShippingOnlyProvider>
        <div className="bg-slate-900 pb-24 pt-8 sm:pt-12 text-white dark:bg-[#0b0c16]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {!isCreatePage ? (
              <ShippingOnlyTopHeader />
            ) : (
              <div className="flex flex-col items-start">
                <Link
                  href="/dashboard/shipping-only"
                  className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Request Shipping Service</h1>
                <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
                  Instruct your supplier to send your shipment to us and ensure that each shipment is labeled with your name and destination country.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          {/* This renders the page.tsx below */}
          {children}
        </main>
      </RecordCountShippingOnlyProvider>
    </div>
  );
}
