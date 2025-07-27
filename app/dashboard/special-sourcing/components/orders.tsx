'use client';

import React, { useState } from 'react';
import OrderCard from '@/app/dashboard/special-sourcing/components/OrderCardSpecialSourcing';

interface Order {
  serialNumber: number;
  id: number;
  pidUser: string;
  pidSpecialSourcing: string;
  productName: string;
  whatsappNumber: string;
  productQualityRatings: string;
  targetUnitPrice: string;
  productDescription: string;
  productImage: string;
  status: string;
  createdAt: string;
}

interface PaymentSectionProps {
  initialOrders: Order[];
  statusx: string;
}

function Orders({ initialOrders }: PaymentSectionProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders as any);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  //alert(orders);
  //special update
  return (
    <>
      <div className="flex w-full flex-col gap-3">
        {orders &&
          orders.map((order, index) => {
            const serialNumber = index + 1; // Auto-incrementing serial number
            return (
              <OrderCard
                serialNumber={serialNumber}
                key={index}
                id={order.id}
                pidUser={order.pidUser}
                pidSpecialSourcing={order.pidSpecialSourcing}
                productName={order.productName}
                whatsappNumber={order.whatsappNumber}
                productQualityRatings={order.productQualityRatings}
                targetUnitPrice={order.targetUnitPrice}
                productDescription={order.productDescription}
                productImage={order.productImage}
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
