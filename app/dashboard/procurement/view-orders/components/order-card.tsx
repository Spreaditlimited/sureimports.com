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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { 
  PackageSearch, 
  Trash2, 
  PlusCircle, 
  AlertTriangle,
  ChevronDown
} from 'lucide-react';

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

  useEffect(() => {
    const fetchProducts = async () => {
      if (!pidUser || !order.pidOrder) return;
      try {
        const res = await fetch(`/api/get-data/procurement-order-products/${pidUser}/${order.pidOrder}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [pidUser, order.pidOrder]);

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
                <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {order.orderName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ref:</span>
                  <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {order.pidOrder}
                  </span>
                </div>
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

                  <DialogContent className="max-w-md gap-0 p-0 overflow-hidden rounded-[32px] border-none shadow-2xl dark:bg-slate-900">
                    <div className="bg-rose-500 p-8 text-center text-white dark:bg-rose-600">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10">
                        <AlertTriangle className="h-8 w-8" />
                      </div>
                      <h2 className="text-2xl font-black">Delete Order?</h2>
                    </div>
                    <div className="p-8 text-center">
                      <p className="text-slate-600 dark:text-slate-400">
                        This action cannot be undone. All products associated with this order reference <strong className="text-slate-900 dark:text-white">({order.pidOrder})</strong> will be permanently removed.
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
              <AccordionTrigger className="!flex-none !justify-center !py-0 flex h-10 w-10 items-center rounded-xl bg-slate-50 p-0 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 [&>svg:last-child]:hidden [&[data-state=open]>svg:first-child]:rotate-180 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:hover:text-white">
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
