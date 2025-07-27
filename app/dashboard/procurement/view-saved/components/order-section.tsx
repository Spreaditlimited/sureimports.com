'use client';

import React, { useState } from 'react';
import OrderCard from './order-card';

interface Product {
  id: number;
  name: string;
  image: string;
  info: string;
  link: string;
  quantity: number;
  unitPrice: number;
  unitWeight: number;
}

interface Order {
  id: number;
  title: string;
  OrderId: string;
  Product: Product[];
}

interface OrdersData {
  Orders: Order[];
}

interface OrderSectionProps {
  initialOrders: OrdersData;
}

function OrderSection({ initialOrders }: OrderSectionProps) {
  const [orders, setOrders] = useState(initialOrders.Orders);

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

export default OrderSection;
