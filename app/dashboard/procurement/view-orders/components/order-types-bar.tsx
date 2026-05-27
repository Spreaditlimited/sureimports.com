'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { useAuth } from '@/app/context/AuthContext';
import Loader from '@/components/uix/Loader';
import { cn } from '@/_lib/utils'; // Assuming you have standard shadcn cn utility

export function useHorizontalScroll<T extends HTMLDivElement>() {
  const elRef = useRef<T>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY,
          behavior: 'smooth',
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);
  return elRef;
}

export default function OrderTypes() {
  const { user } = useAuth();
  const path = usePathname();
  const scrollRef = useHorizontalScroll<HTMLDivElement>();
  
  const [pidUser] = useState(user?.pidUser);
  const [recordx, setRecord] = useState<any | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      if (!pidUser) return;
      try {
        const res = await fetch(`/api/get-data/procurement-count/${pidUser}/saved`);
        const data = await res.json();
        setRecord(data);
      } catch (error) {
        console.error("Failed to fetch order counts", error);
      }
    };
    fetchRecord();
  }, [pidUser]);

  if (!user?.pidUser) {
    return <Loader />;
  }

  // Unified the array: removed arbitrary colors, kept it purely data-driven
  const OrderTypeItems = [
    { title: 'Saved', count: recordx?.savedOrderCount, href: '/dashboard/procurement/view-orders/saved' },
    { title: 'Pending', count: recordx?.pendingOrderCount, href: '/dashboard/procurement/view-orders/pending' },
    { title: 'Approved', count: recordx?.approvedOrderCount, href: '/dashboard/procurement/view-orders/approved' },
    { title: 'Pay Shipping', count: recordx?.payForShippingOrderCount, href: '/dashboard/procurement/view-orders/pay-for-shipping' },
    { title: 'In-Transit', count: recordx?.inTransitOrderCount, href: '/dashboard/procurement/view-orders/in-transit' },
    { title: 'Ready For Pickup', count: recordx?.readyForPickupOrderCount, href: '/dashboard/procurement/view-orders/ready-for-pickup' },
    { title: 'Completed', count: recordx?.completedOrdersCount, href: '/dashboard/procurement/view-orders/completed' },
    { title: 'On-Hold', count: recordx?.onHoldOrdersCount, href: '/dashboard/procurement/view-orders/on-hold' },
    { title: 'Bank Pending (Saved)', count: recordx?.bankPendingSavedOrdersCount, href: '/dashboard/procurement/view-orders/bank-pending-saved-orders' },
    { title: 'Bank Pending (Shipping)', count: recordx?.bankPendingShippingOrdersCount, href: '/dashboard/procurement/view-orders/bank-pending-shipping-orders' },
    { title: 'Cancelled', count: recordx?.cancelledOrdersCount, href: '/dashboard/procurement/view-orders/cancelled' },
  ];

  return (
    <div className="relative mb-6 w-full border-b border-slate-200 dark:border-slate-800">
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-2 overflow-x-auto py-3 px-1 scroll-smooth"
      >
        {OrderTypeItems.map((item) => {
          const isActive = path === item.href;
          const count = item.count as number | undefined;

          return (
            <Link
              href={item.href}
              key={item.title}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              )}
            >
              <span>{item.title}</span>
              
              {/* Dynamic Notification Badge */}
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    "flex h-5 items-center justify-center rounded-full px-2 text-[10px] font-black transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700"
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      
      {/* Optional fade indicators for scrollable areas (keeps the UI looking premium) */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-8 bg-gradient-to-l from-[#fcfcfd] to-transparent dark:from-slate-950" />
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-8 bg-gradient-to-r from-[#fcfcfd] to-transparent dark:from-slate-950" />
    </div>
  );
}