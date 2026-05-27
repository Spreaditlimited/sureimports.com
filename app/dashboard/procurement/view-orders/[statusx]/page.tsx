'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import OrderSection from '../../view-orders/components/order-section';
import CreateOrder from '../../create-order/components/createOrder';
import Loader from '@/components/uix/Loader';
import { 
  Search, 
  LayoutList
} from 'lucide-react';
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
    if (pidUser && statusx) {
      fetchOrder(pidUser, statusx);
    } else if (!pidUser) {
      setLoading(true); 
    }
  }, [pidUser, statusx]);

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

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      
      {/* Deep Slate Hero Section */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  Procurement Tracker
                </span>
              </div>
              
              {/* Inline Status Navigation */}
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  Viewing
                </h1>
                <Select value={currentStatus} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-10 w-40 rounded-xl border-white/20 bg-white/10 px-4 text-lg font-bold text-white shadow-none backdrop-blur-md focus:ring-0 focus:ring-offset-0 dark:border-slate-700 dark:bg-slate-800 sm:h-12 sm:w-48 sm:text-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                    <SelectItem value="saved">Saved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                  Orders
                </h1>
              </div>
              
              <p className="mt-4 text-sm font-medium text-slate-400 md:text-base">
                View, track, and manage your sourcing requests.
              </p>
            </div>
            
            <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
              <CreateOrder className="h-12 rounded-xl bg-[#2E62D9] px-6 text-sm font-semibold text-white shadow-lg shadow-[#2E62D9]/30 hover:bg-[#2754BC] max-md:w-full md:w-auto xl:w-auto" />
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20">
                  <LayoutList className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">Total Count</p>
                  <p className="text-sm font-black text-indigo-400">{countRecords.length} Items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        
        {countRecords.length === 0 ? (
          /* Premium Empty State */
          <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/50 py-24 text-center backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Search className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} Orders
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              You currently don't have any procurement requests in this state.
            </p>
            <button
              onClick={() => router.push('/dashboard/procurement/create-order')}
              className="mt-8 flex items-center gap-2 rounded-xl bg-[#2E62D9] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#2E62D9]/30 transition hover:bg-[#2754BC] active:scale-[0.98]"
            >
              Create New Order
            </button>
          </div>
        ) : (
          /* Order Section Wrapper */
          <div className="rounded-[32px] bg-transparent">
            <OrderSection initialOrders={orderData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default ViewOrders;
