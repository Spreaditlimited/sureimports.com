'use client';

import React, { useState } from 'react';
import OrderCard from './payment-card';

interface Order {
  id: number;
  title: string;
  OrderId: string;
}

interface PaymentSectionProps {
  initialOrders: Order[];
}

function PaymentSection({ initialOrders }: PaymentSectionProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleDelete = (id: number) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          id={order.id}
          order={order}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default PaymentSection;
