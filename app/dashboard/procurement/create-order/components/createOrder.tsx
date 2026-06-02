'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import CreateOrderForm from './create-order-form';
import { PackagePlus, X } from 'lucide-react';

interface CreateOrderProps {
  className?: string;
}

function CreateOrder({ className }: CreateOrderProps) {
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  return (
    <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={`h-[49px] py-[15px] font-normal max-md:w-full md:px-[30px] xl:w-[162px] ${className || ''}`}
        >
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="block max-h-[90vh] w-[calc(100vw-2rem)] max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white p-0 shadow-2xl dark:border-slate-700 dark:bg-[#161629] sm:rounded-[32px] lg:max-w-5xl [&>button]:hidden">
        <div className="relative overflow-hidden border-b border-slate-100 bg-white px-6 py-5 dark:border-slate-800 dark:bg-[#161629] sm:px-8">
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-blue-600/10 via-indigo-500/5 to-transparent dark:from-blue-600/20 dark:via-indigo-500/10" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <span className="mb-2 inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                Procurement
              </span>
              <DialogTitle className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">
                <PackagePlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Create New Order
              </DialogTitle>
            </div>

            <DialogClose className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 shadow-sm transition hover:bg-slate-200 hover:text-slate-900 dark:border-slate-700 dark:bg-[#0f1020] dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Close create order modal</span>
            </DialogClose>
          </div>
        </div>

        <div className="custom-scrollbar max-h-[calc(90vh-112px)] overflow-y-auto bg-white px-6 py-6 dark:bg-[#161629] sm:px-8">
          <CreateOrderForm setIsOpen={setIsOpen} />
          {/* <CreateOrderForm /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrder;
