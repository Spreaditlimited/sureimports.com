'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import CreateOrderForm from './create-order-form';

function CreateOrder() {
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  return (
    <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-[49px] py-[15px] font-normal max-md:w-full md:px-[30px] xl:w-[162px]">
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-hidden bg-[#ffffff] p-0 dark:bg-black lg:max-w-[1030px]">
        <DialogHeader className="sticky top-0 bg-white px-6 py-4 dark:bg-black">
          <DialogTitle className="text-[28px] text-slate-800 dark:text-slate-100">
            Create New Order
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-4 dark:bg-black">
          <CreateOrderForm setIsOpen={setIsOpen} />
          {/* <CreateOrderForm /> */}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrder;
