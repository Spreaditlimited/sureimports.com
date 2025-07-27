import React, { useEffect, useRef, useState } from 'react';
//import { OrderTypeItems } from './order-types';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/_lib/utils';
import Link from 'next/link';

import { useAuth } from '@/app/context/AuthContext';
import { useRecord } from '@/app/context/RecordCountProcurementContext';
import Loader from '@/components/uix/Loader';

export function useHorizontalScroll<T extends HTMLDivElement>() {
  const elRef = useRef<T>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY == 0) return;
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

function OrderTypes() {
  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const statusx = 'saved';
  const [recordx, setRecord] = useState<any | null>(null);

  useEffect(() => {
    const fetchRecord = async () => {
      const res = await fetch(
        `/api/get-data/procurement-count/${pidUser}/${statusx}`,
      );
      const data = await res.json();
      setRecord(data);
    };
    fetchRecord();
  }, [pidUser]);

  //alert(pidUser)
  if (!user?.pidUser) {
    return <Loader />;
  }

  const OrderTypeItems = [
    {
      title: 'Saved Orders',
      count: recordx?.savedOrderCount,
      href: '/dashboard/procurement/view-orders/saved',
      color: 'bg-orange-500',
    },
    {
      title: 'Pending Orders',
      count: recordx?.pendingOrderCount,
      href: '/dashboard/procurement/view-orders/pending',
      color: 'bg-green-500',
    },
    {
      title: 'Approved Orders',
      count: recordx?.approvedOrderCount,
      href: '/dashboard/procurement/view-orders/approved',
      color: 'bg-orange-500',
    },
    {
      title: 'Pay For Shipping',
      count: recordx?.payForShippingOrderCount,
      href: '/dashboard/procurement/view-orders/pay-for-shipping',
      color: 'bg-blue-500',
    },
    {
      title: 'In-Transit',
      count: recordx?.inTransitOrderCount,
      href: '/dashboard/procurement/view-orders/in-transit',
      color: 'bg-orange-500',
    },
    {
      title: 'Ready For Pickup',
      count: recordx?.readyForPickupOrderCount,
      href: '/dashboard/procurement/view-orders/ready-for-pickup',
      color: 'bg-orange-500',
    },
    {
      title: 'Completed Orders',
      count: recordx?.completedOrdersCount,
      href: '/dashboard/procurement/view-orders/completed',
      color: 'bg-orange-500',
    },
    {
      title: 'On-Hold Orders',
      count: recordx?.onHoldOrdersCount,
      href: '/dashboard/procurement/view-orders/on-hold',
      color: 'bg-orange-500',
    },
    {
      title: 'Bank Pending (Saved)',
      count: recordx?.bankPendingSavedOrdersCount,
      href: '/dashboard/procurement/view-orders/bank-pending-saved-orders',
      color: 'bg-orange-500',
    },
    {
      title: 'Bank Pending (Shipping)',
      count: recordx?.bankPendingShippingOrdersCount,
      href: '/dashboard/procurement/view-orders/bank-pending-shipping-orders',
      color: 'bg-orange-500',
    },
    {
      title: 'Cancelled Orders',
      count: recordx?.cancelledOrdersCount,
      href: '/dashboard/procurement/view-orders/cancelled',
      color: 'bg-orange-500',
    },
  ];

  const path = usePathname();
  const scrollref = useHorizontalScroll();

  return (
    <div
      ref={scrollref}
      className="hide-scrollbar flex gap-[10px] overflow-auto pt-[20px]"
    >
      {OrderTypeItems.map((Item) => (
        <Link
          href={Item.href}
          key={Item.title}
          className={cn(
            buttonVariants({}),
            'rounded-[80px] border-slate-100 bg-white text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
            path === Item.href &&
              'bg-indigo-800 text-white hover:bg-indigo-800/90',
          )}
        >
          <div className="flex gap-1.5">
            <div>{Item.title}</div>
            {(Item.count as any) > 0 && path != Item.href && (
              <div
                className={cn(
                  'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
                  Item.color,
                )}
              >
                {Item.count}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default OrderTypes;
