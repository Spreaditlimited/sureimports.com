'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import React, { useState } from 'react';
import CreateOrderForm from './create-order-form';
import styles from './create-order.module.css';
import { PackagePlus, X } from 'lucide-react';

interface CreateOrderProps {
  className?: string;
  renderForm?: (close: () => void) => React.ReactNode;
}

function CreateOrder({ className, renderForm }: CreateOrderProps) {
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
      <DialogContent className={styles.dialog}>
        <div className={styles.header}>
          <div className={styles.headingIcon}><PackagePlus size={22} aria-hidden="true" /></div>
          <div className={styles.headingCopy}>
            <p className={styles.eyebrow}>Procurement</p>
            <DialogTitle className={styles.title}>Create an order</DialogTitle>
            <DialogDescription className={styles.description}>Set up your shipment, then add your products.</DialogDescription>
          </div>
          <DialogClose className={styles.close}>
            <X size={20} aria-hidden="true" />
            <span className="sr-only">Close create order</span>
          </DialogClose>
        </div>
        <div className={styles.body}>
          {renderForm ? renderForm(() => handleOpenChange(false)) : <CreateOrderForm setIsOpen={setIsOpen} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOrder;
