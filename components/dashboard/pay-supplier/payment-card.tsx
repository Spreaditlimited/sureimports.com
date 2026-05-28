'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react';
import Image from 'next/image';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import BankDepositForm from './deposite-form';

interface Order {
  id: number;
  order: {
    OrderId: string;
    id: number;
    title: string;
  };
  onDelete: (id: number) => void;
}
function OrderCard({ id, order, onDelete }: Order) {
  const [isOpen, setIsOpen] = useState<{ isOpen: boolean }>({ isOpen: false });

  const handleOpenChange = (open: boolean) => {
    setIsOpen({ isOpen: open });
  };

  const handleDelete = () => {
    console.log('deleted');
    onDelete(id);
    setIsOpen({ isOpen: false });
  };

  const onKeep = () => {
    console.log('kept');
    setIsOpen({ isOpen: false });
  };

  return (
    <div className="">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <div className="flex flex-col items-start justify-between gap-3 rounded-xl bg-white px-5 py-5 transition-all duration-200 dark:bg-[#161629] sm:flex-row xl:h-[100px] xl:items-center">
            <div>
              <div className="flex flex-row gap-4">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-lg bg-slate-100 text-center text-4xl font-bold capitalize text-slate-300 dark:bg-slate-800 dark:text-white">
                  {order.id}
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-xl font-bold capitalize text-slate-800 dark:text-slate-200">
                    {order.title}
                  </div>
                  <div className="text-base font-normal text-slate-950 dark:text-slate-100">
                    Order Id:{' '}
                    <span className="text-slate-600">{order.OrderId}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 max-sm:w-full md:flex-row">
              <div className="flex gap-3">
                <Dialog open={isOpen.isOpen} onOpenChange={handleOpenChange}>
                  <DialogTrigger asChild>
                    <Button className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-red-100 p-0 font-normal hover:bg-red-200">
                      <Image
                        src="/icons/delete.svg"
                        alt="delete"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col items-center justify-center overflow-auto rounded-[20px] py-[30px] dark:bg-[#161629] sm:max-w-[396px]">
                    <Image
                      src="/icons/deletewarning.svg"
                      alt="delete"
                      width={100}
                      height={100}
                      className="cursor-pointer"
                    />
                    <div className="w-[280px] text-center text-2xl font-bold text-slate-800 dark:text-white">
                      Are you sure you want to delete?
                    </div>
                    <div className="flex w-80 text-center text-sm text-slate-600">
                      This will delete this record and you cannot recover it.
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={onKeep}
                        className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-slate-100 px-[30px] py-[15px] text-base text-slate-600 hover:bg-slate-200 lg:w-[162px]"
                      >
                        No! keep it
                      </Button>
                      <Button
                        onClick={handleDelete}
                        className="h-[49px] items-center justify-center gap-2.5 rounded-xl bg-red-100 px-[30px] py-[15px] text-base text-red-500 hover:bg-red-200 lg:w-[162px]"
                      >
                        {' '}
                        Yes! Remove
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <AccordionTrigger className="item-ceneter flex h-11 w-11 justify-center rounded-lg bg-slate-100 p-0 text-slate-600 hover:bg-black/10"></AccordionTrigger>
              </div>
            </div>
          </div>
          <AccordionContent className="hide-scrollbar border-t-2 bg-white dark:bg-[#161629]">
            <BankDepositForm />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default OrderCard;
