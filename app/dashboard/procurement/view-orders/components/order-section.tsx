'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';
import OrderCard from './order-card';

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

interface OrderSectionProps {
  initialOrders: any; // Can be an array or an object of orders
}

export default function OrderSection({ initialOrders }: OrderSectionProps) {
  const router = useRouter(); // MUST be called at the top level, not inside functions
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Safely format the incoming data into an array
  useEffect(() => {
    if (!initialOrders) {
      setOrders([]);
      return;
    }
    
    const formattedOrders = Array.isArray(initialOrders) 
      ? initialOrders 
      : Object.values(initialOrders);
      
    setOrders(formattedOrders as OrderData[]);
  }, [initialOrders]);

  const handleDelete = async (pidOrder: string) => {
    if (!user?.pidUser) return;

    try {
      setIsDeleting(pidOrder);
      toast.loading('Deleting order...', { id: `delete-${pidOrder}` });

      const res = await fetch(
        `/api/crud/procurement-delete-order/${user.pidUser}/${pidOrder}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete order');
      }

      const data = await res.json();

      if (data.responsex?.status === 'SUCCESS') {
        toast.success(data.responsex.message, { id: `delete-${pidOrder}` });
        
        // Optimistic UI Update: Instantly remove it from the screen without a full reload
        setOrders((prev) => prev.filter((order) => order.pidOrder !== pidOrder));
        
        // Refresh the router in the background to sync server state
        router.refresh();
      } else {
        toast.error(data.responsex?.message || 'Failed to delete order', { id: `delete-${pidOrder}` });
      }
    } catch (error: any) {
      console.error(error.message);
      toast.error('An error occurred while deleting.', { id: `delete-${pidOrder}` });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {orders.map((order, index) => (
        <div 
          key={order.pidOrder || index}
          className={`transition-all duration-300 ${
            isDeleting === order.pidOrder ? 'pointer-events-none opacity-50 blur-sm' : 'opacity-100'
          }`}
        >
          <OrderCard
            id={index + 1}
            order={order}
            onDelete={() => handleDelete(order.pidOrder)}
          />
        </div>
      ))}
    </div>
  );
}