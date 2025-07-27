'use client';

import React, { Suspense, useEffect, useState } from 'react';
import OrderCard from './order-card';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

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

interface OrderData {
  id: any;
  pidOrder: string;
  pidUser: string;
  orderName: string;
  destinationCountry: string;
  currencyType: string;
  shippingPlan: string;
  orderCategory: string;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

interface Orders {
  Orders: OrderData[];
}

interface OrderSectionProps {
  initialOrders: OrderData;
}

function OrderSection({ initialOrders }: OrderSectionProps) {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [orders, setOrders] = useState(initialOrders as any);
  const [loading, setLoading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleDelete = async (pidOrder: number) => {
    //------------------------- PRODUCT DELETE FUNCTION --------------------------//

    try {
      const router = useRouter();

      toast.info('Processing . . .' + orders[0]['pidOrder']);
      setLoading(true);
      console.log('Reloading child component...');
      setReloadKey((prev) => prev + 1); // Change the key to force a re-render

      const res = await fetch(
        `/api/crud/procurement-delete-order/${user?.pidUser}/${pidOrder}`,
      );

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      if (data.responsex.status == 'SUCCESS') {
        toast.success(data.responsex.message);
        router.refresh();
      }
      if (data.responsex.status == 'FAILED') {
        toast.warning(data.responsex.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOrders(initialOrders);
  }, [orders, reloadKey]);

  return (
    <div key={reloadKey} className="flex w-full flex-col gap-3">
      {orders.map((order: any, index: any) => (
        <OrderCard
          key={order.id}
          id={index + 1}
          order={order}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default OrderSection;
