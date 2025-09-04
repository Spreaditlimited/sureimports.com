'use client';

import React, { useState } from 'react';
import OrderCard from '@/app/dashboard/verify-supplier/components/OrderCardVerifySupplier';

interface Order {
  serialNumber: number;
  id: number;
  pidUser: string;
  pidVerifySupplier: string;
  supplierName: string;
  supplierPhone: string;
  supplierAddress: string;
  supplierProduct: string;
  supplierWebsite: string;
  supplierDetails: string;
  status: string;
  createdAt: string;
}

interface PaymentSectionProps {
  initialOrders: Order[];
  statusx: string;
}

function Orders({ initialOrders }: PaymentSectionProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  //special update
  return (
    <>
      <div className="flex w-full flex-col gap-3 dark:bg-black">
        {orders.map((order, index) => {
          const serialNumber = index + 1; // Auto-incrementing serial number
          return (
            <OrderCard
              serialNumber={serialNumber}
              key={index}
              id={order.id}
              pidUser={order.pidUser}
              pidVerifySupplier={order.pidVerifySupplier}
              supplierName={order.supplierName}
              supplierPhone={order.supplierPhone}
              supplierAddress={order.supplierAddress}
              supplierProduct={order.supplierProduct}
              supplierWebsite={order.supplierWebsite}
              supplierDetails={order.supplierDetails}
              status={order.status}
              createdAt={order.createdAt}
            />
          );
        })}
      </div>
    </>
  );
}

export default Orders;
