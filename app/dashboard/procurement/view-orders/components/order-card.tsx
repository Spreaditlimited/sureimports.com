'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  PackageSearch,
  Trash2,
  PlusCircle,
  AlertTriangle,
  ChevronDown,
  Clock3,
} from 'lucide-react';

import { getSavedOrderCountdown } from '@/lib/procurement/savedOrderExpiry';
import MoreOrders from './products-table/orders-view-more';

interface Order {
  id: any;
  pidOrder: string;
  pidUser: string;
  orderName: string;
  status: string;
  createdAt: string;
}

interface OrderCardProps {
  id: number;
  order: Order;
  onDelete: (id: string) => void; // Expect string to match pidOrder
}

export default function OrderCard({ id, order, onDelete }: OrderCardProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] = useState<any>(null);
  const [pidUser] = useState(user?.pidUser);
  const [loading, setLoading] = useState(false);
  const [countdownNow, setCountdownNow] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!pidUser || !order.pidOrder) return;
      try {
        const res = await fetch(
          `/api/get-data/procurement-order-products/${pidUser}/${order.pidOrder}`,
        );
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [pidUser, order.pidOrder]);

  useEffect(() => {
    if (order.status !== 'saved') return;

    const updateCountdown = () => setCountdownNow(Date.now());
    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 60_000);

    return () => window.clearInterval(intervalId);
  }, [order.status]);

  const savedOrderCountdown =
    order.status === 'saved' && countdownNow !== null
      ? getSavedOrderCountdown(order.createdAt, countdownNow)
      : null;

  const countdownTone =
    savedOrderCountdown?.tone === 'urgent'
      ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300'
      : savedOrderCountdown?.tone === 'warning'
        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300'
        : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300';

  const handleDelete = async () => {
    // Rely on parent to handle API call and state removal for optimistic UI
    setIsOpen(false);
    onDelete(order.pidOrder);
  };

  const handleAddProduct = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent accordion from toggling
    router.push(`/dashboard/procurement/add-product/${order.pidOrder}`);
  };

  if (!productData) {
    return (
      <div className="h-24 w-full animate-pulse rounded-[24px] bg-slate-50 dark:bg-slate-800/50" />
    );
  }

  return (
    <div className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <Accordion type="single" collapsible className="w-full border-none">
        <AccordionItem value={`item-${order.pidOrder}`} className="border-none">
          {/* Card Header (Always Visible) */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left Info Section */}
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                <PackageSearch className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="line-clamp-1 text-lg font-bold text-slate-900 dark:text-white">
                  {order.orderName}
                </h3>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Ref:
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {order.pidOrder}
                  </span>
                </div>
                {savedOrderCountdown ? (
                  <div
                    className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${countdownTone}`}
                    title={`This saved order will be removed on ${savedOrderCountdown.expiresAt.toLocaleString('en-GB')}`}
                  >
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{savedOrderCountdown.text}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Right Action Section */}
            <div className="flex items-center gap-2 sm:shrink-0">
              {/* Add Product Button */}
              {(order.status === 'saved' || order.status === 'on-hold') && (
                <button
                  onClick={handleAddProduct}
                  className="flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
                >
                  <PlusCircle className="h-4 w-4" /> Add Product
                </button>
              )}

              {/* Delete Button & Modal */}
              {order.status === 'saved' && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100 hover:text-rose-600 dark:bg-rose-900/20 dark:hover:bg-rose-900/40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </DialogTrigger>

                  <DialogContent className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] gap-0 overflow-hidden rounded-[32px] border-none p-0 shadow-2xl dark:bg-slate-900 sm:max-w-md">
                    <DialogTitle className="sr-only">
                      Delete procurement order confirmation
                    </DialogTitle>
                    <div className="bg-rose-500 p-8 text-center text-white dark:bg-rose-600">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10">
                        <AlertTriangle className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-black">Delete Order?</h2>
                    </div>
                    <div className="p-8 text-center">
                      <p className="text-slate-600 dark:text-slate-400">
                        This action cannot be undone. All products associated
                        with this order reference{' '}
                        <strong className="text-slate-900 dark:text-white">
                          ({order.pidOrder})
                        </strong>{' '}
                        will be permanently removed.
                      </p>
                      <div className="mt-8 flex gap-3">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="flex-1 rounded-xl bg-slate-100 py-4 text-sm font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        >
                          Keep Order
                        </button>
                        <button
                          onClick={handleDelete}
                          className="flex-1 rounded-xl bg-rose-500 py-4 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600 active:scale-[0.98]"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Custom Accordion Trigger */}
              <AccordionTrigger className="flex h-10 w-10 !flex-none items-center !justify-center rounded-xl bg-slate-50 p-0 !py-0 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:text-white [&>svg:last-child]:hidden [&[data-state=open]>svg:first-child]:rotate-180">
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
              </AccordionTrigger>
            </div>
          </div>

          {/* Expandable Content (Products Table) */}
          <AccordionContent className="border-t border-slate-100 bg-slate-50/50 p-0 dark:border-slate-800 dark:bg-slate-900/30">
            <MoreOrders products={productData as any} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
