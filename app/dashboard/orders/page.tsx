'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ChevronRight,
  CreditCard,
  Calendar,
  Layers,
  ArrowRight,
  History,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

// Types remain the same as your logic
interface Order {
  id: string; pidStore: string; pidProduct: string; pidUser: string;
  product_name: string; unit_price: string; total_price: string;
  quantity: string; status: string; ext1: string | null; ext2: string | null;
  createdAt: Date; updatedAt: Date;
}

interface GroupedOrder {
  transactionRef: string; products: Order[]; totalAmount: number;
  status: string; paymentMethod: string | null; orderDate: Date; orderIds: string[];
}

type OrderCategory = 'active' | 'recent' | 'old';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; label: string; progress: number }> = {
  PAID: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: CheckCircle, label: 'Paid', progress: 20 },
  PROCESSING: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', icon: Clock, label: 'Processing', progress: 40 },
  SHIPPED: { color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', icon: Truck, label: 'In Transit', progress: 70 },
  DELIVERED: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: Package, label: 'Delivered', progress: 90 },
  COMPLETED: { color: 'text-slate-900', bg: 'bg-slate-50 border-slate-200', icon: CheckCircle, label: 'Completed', progress: 100 },
  CANCELLED: { color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100', icon: XCircle, label: 'Cancelled', progress: 0 },
};

const toValidDate = (value: unknown) => {
  const parsed = new Date(value as any);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const safeFormatDate = (dateValue: unknown) => {
  const parsed = toValidDate(dateValue);
  if (!parsed) return 'N/A';
  try {
    return format(parsed, 'MMM dd, yyyy');
  } catch {
    return 'N/A';
  }
};

export default function MyOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderCategory>('active');

  // Logic remains untouched (fetchOrders, groupOrdersByTransaction, categorizeOrders)
  useEffect(() => { if (user?.pidUser) fetchOrders(); }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      if (data.statusx === 'SUCCESS') {
        const ordersWithDates = data.data.map((order: any) => ({
          ...order,
          createdAt: toValidDate(order.createdAt) ?? new Date(),
          updatedAt: toValidDate(order.updatedAt) ?? new Date(),
        }));
        setGroupedOrders(groupOrdersByTransaction(ordersWithDates));
      }
    } catch (error) { toast.error('Failed to load orders'); } finally { setLoading(false); }
  };

  const groupOrdersByTransaction = (orders: Order[]): GroupedOrder[] => {
    const groupMap = new Map<string, Order[]>();
    orders.forEach((order) => {
      const transactionRef = order.ext1 || `SINGLE_${order.pidStore}`;
      if (!groupMap.has(transactionRef)) groupMap.set(transactionRef, []);
      groupMap.get(transactionRef)!.push(order);
    });
    const grouped: GroupedOrder[] = [];
    groupMap.forEach((products, transactionRef) => {
      const totalAmount = products.reduce((sum, p) => sum + parseFloat(p.total_price), 0);
      const validTimes = products
        .map((p) => toValidDate(p.createdAt)?.getTime())
        .filter((x): x is number => typeof x === 'number' && Number.isFinite(x));
      const orderDate = validTimes.length > 0 ? new Date(Math.min(...validTimes)) : new Date();
      const statusPriority: Record<string, number> = { PAID: 1, PROCESSING: 2, SHIPPED: 3, DELIVERED: 4, COMPLETED: 5, CANCELLED: 6 };
      const status = products.reduce((prev, curr) => (statusPriority[curr.status] || 999) < (statusPriority[prev] || 999) ? curr.status : prev, products[0].status);
      grouped.push({ transactionRef, products, totalAmount, status, paymentMethod: products[0].ext2, orderDate, orderIds: products.map(p => p.pidStore) });
    });
    return grouped.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  };

  const categorized = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return {
      active: groupedOrders.filter(o => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status)),
      recent: groupedOrders.filter(o => o.status === 'COMPLETED' && o.orderDate >= thirtyDaysAgo),
      old: groupedOrders.filter(o => (o.status === 'COMPLETED' && o.orderDate < thirtyDaysAgo) || o.status === 'CANCELLED')
    };
  };

  const category = categorized();
  const currentOrders = activeTab === 'active' ? category.active : activeTab === 'recent' ? category.recent : category.old;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-[#fcfcfd] dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-sm font-bold text-slate-500">Loading your shipments...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      {/* Hero Header */}
      <div className="bg-slate-900 pb-32 pt-12 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-500/20">
                  Store Purchases
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Order History</h1>
              <p className="mt-2 text-slate-400">Track and manage your products purchased from our store.</p>
            </div>

            {/* Quick Stats Overlay */}
            <div className="flex items-center gap-6 rounded-3xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shrink-0">
               <div className="flex flex-col border-r border-white/10 pr-6">
                <span className="text-[10px] font-bold uppercase text-slate-500 mb-1">In Transit</span>
                <span className="text-2xl font-black">{category.active.length}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-slate-500 mb-1">Total Orders</span>
                <span className="text-2xl font-black">{groupedOrders.length}</span>
              </div>
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 ml-2">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto -mt-16 max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar rounded-2xl bg-white p-2 shadow-sm border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          {[
            { id: 'active', label: 'Active', count: category.active.length, icon: Clock },
            { id: 'recent', label: 'Recent', count: category.recent.length, icon: CheckCircle },
            { id: 'old', label: 'Archive', count: category.old.length, icon: History }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-1 min-w-[120px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md dark:bg-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => {
              const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.PAID;
              const StatusIcon = config.icon;
              const displayRef = order.transactionRef.startsWith('SINGLE_') 
                ? order.transactionRef.replace('SINGLE_', '') 
                : order.transactionRef;

              return (
                <div key={order.transactionRef} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col lg:flex-row">
                    {/* Left: Shipment Summary */}
                    <div className="p-6 lg:w-1/3 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-tight ${config.bg} ${config.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {config.label}
                        </div>
                        <span className="text-[10px] font-bold uppercase text-slate-400">#{displayRef.substring(0, 10)}</span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        ₦{order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">Order Amount</p>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{safeFormatDate(order.orderDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-4 w-4 text-slate-400" />
                          <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase">
                            {order.paymentMethod || 'PAYMENT'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Tracking Progress */}
                      {order.status !== 'CANCELLED' && (
                        <div className="mt-8">
                          <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 mb-2">
                             <span>Tracking Status</span>
                             <span>{config.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className={`h-full transition-all duration-700 rounded-full ${config.color.replace('text', 'bg')}`} style={{ width: `${config.progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Products List */}
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Order Items ({order.products.length})</span>
                      </div>
                      
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                        {order.products.map((product) => (
                          <div key={product.id} className="flex items-start justify-between rounded-2xl bg-slate-50/50 p-4 dark:bg-slate-800/30">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.product_name}</p>
                              <div className="mt-1 flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Qty: {product.quantity}</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span className="text-[10px] font-bold text-slate-500 tracking-tighter">₦{parseFloat(product.unit_price).toLocaleString()} / unit</span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-sm font-black text-slate-900 dark:text-white">₦{parseFloat(product.total_price).toLocaleString()}</p>
                              <span className="text-[10px] font-bold text-blue-600">#{product.pidStore}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Button variant="ghost" className="text-xs font-bold text-blue-600 hover:bg-blue-50">
                          View Full Details <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="rounded-full bg-slate-50 p-6 dark:bg-slate-800">
                <Package className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">No {activeTab} orders</h3>
              <p className="mt-2 text-slate-500 max-w-xs mx-auto">Your orders will appear here once they are placed and confirmed by our system.</p>
              <button onClick={() => router.push('/shop')} className="mt-8 flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition hover:bg-blue-500">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
