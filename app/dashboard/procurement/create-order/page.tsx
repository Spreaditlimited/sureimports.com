'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateOrderForm from './components/create-order-form';
import { 
  PackagePlus, 
  ShieldCheck, 
  Globe, 
  ArrowLeft 
} from 'lucide-react';

function CreateOrder() {
  const router = useRouter();
  
  // Kept your original state structure, but now we actually pass it to the form
  // to avoid the "Function not implemented" error.
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: true });

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Deep Slate Hero Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          <button 
            onClick={() => router.back()} 
            className="group mb-8 flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Procurement
          </button>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  Procurement & Shipping
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Create New Order
              </h1>
              <p className="mt-3 text-sm font-medium text-slate-400 md:text-base">
                Paste your product links, and we'll handle the buying, quality inspection, and delivery.
              </p>
            </div>
            
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                <Globe className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white">Global Sourcing</p>
                <p className="text-xs text-slate-400">Verified Suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Form Container Container */}
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/20 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          
          {/* Header Strip inside the card */}
          <div className="flex items-center gap-3 border-b border-slate-100 p-6 sm:px-10 sm:py-8 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <PackagePlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Order Details</h2>
              <p className="text-xs text-slate-500">Please provide accurate links and specifications.</p>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-10">
            <CreateOrderForm setIsOpen={setIsOpen} />
          </div>
          
          {/* Minimalist Trust Footer */}
          <div className="flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/50 p-6 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Your orders are protected by our comprehensive quality guarantee.
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateOrder;