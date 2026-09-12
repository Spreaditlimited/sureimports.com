'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import ProcurementTrackerFrame from '../components/ProcurementTrackerFrame';
import ProcurementEmptyState from '../components/ProcurementEmptyState';
import OrderSection from '../../view-orders/components/order-section';
import ProcurementDraftTools from '../../view-orders/components/ProcurementDraftTools';
import CreateOrder from '../../create-order/components/createOrder';
import Loader from '@/components/uix/Loader';
import { Search, LayoutList } from 'lucide-react';
import { PROCUREMENT_STATUS_ITEMS } from '@/app/dashboard/procurement/constants/order-statuses';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

interface orderStatus {
  params: Promise<{ statusx: string }>;
}

export function ViewOrders({ params }: orderStatus) {
  const router = useRouter();
  const { user } = useAuth();
  
  const { statusx } = use(params);
  const currentStatus = statusx ? statusx.toLowerCase() : 'saved';
  const validStatusValues = new Set(
    PROCUREMENT_STATUS_ITEMS.map((item) => item.value),
  );
  const normalizedStatus = validStatusValues.has(currentStatus)
    ? currentStatus
    : 'saved';
  
  const [pidUser] = useState(user?.pidUser);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async (userId: string, status: string) => {
    try {
      const res = await fetch(`/api/get-data/procurement/${userId}/${status}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }
      const data = await res.json();
      setOrderData(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pidUser) {
      fetchOrder(pidUser, normalizedStatus);
    } else if (!pidUser) {
      setLoading(true);
    }
  }, [pidUser, normalizedStatus]);

  const countRecords: OrderData[] = orderData ? Object.values(orderData) : [];

  const handleStatusChange = (newStatus: string) => {
    router.push(`/dashboard/procurement/view-orders/${newStatus}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
        <div className="h-64 bg-slate-900 pb-32 pt-12 text-white"></div>
        <div className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="flex h-96 items-center justify-center rounded-[32px] border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  return <ProcurementTrackerFrame status={normalizedStatus} onStatusChange={handleStatusChange} count={countRecords.length} createControl={<CreateOrder className="h-12 rounded-xl bg-[#2E62D9] px-6 text-sm font-semibold text-white" />}>
        {normalizedStatus === 'saved' && <ProcurementDraftTools onChanged={() => fetchOrder(pidUser!, normalizedStatus)} />}
        
        {countRecords.length === 0 ? (
          <ProcurementEmptyState status={normalizedStatus} action={<button onClick={() => router.push('/dashboard/procurement/create-order')} className="rounded-xl bg-[#2E62D9] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#2E62D9]/30 transition hover:bg-[#2754BC]">Create New Order</button>} />
        ) : (
          /* Order Section Wrapper */
          <div className="rounded-[32px] bg-transparent">
            <OrderSection initialOrders={orderData} />
          </div>
        )}
  </ProcurementTrackerFrame>;
}

export default ViewOrders;
