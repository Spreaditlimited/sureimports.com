'use client';
import React, { useState } from 'react';
import CreateOrderForm from './components/create-order-form';

function CreateOrder() {
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: true });

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  return (
    <>
      <div className="bg-slate-100 dark:bg-slate-800">
        <div className="flex flex-col pl-6 pt-6 text-[28px] font-bold text-slate-800 dark:text-white lg:flex-row lg:items-center lg:gap-3">
          Create Order
          <span className="text-base font-normal text-slate-800 dark:text-slate-400">
            (Procurement & Shipping)
          </span>
        </div>

        <div className="rounded-xl">
          <CreateOrderForm
            setIsOpen={function (
              value: React.SetStateAction<{ isOpen: boolean }>,
            ): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
      </div>
    </>
  );
}

export default CreateOrder;
