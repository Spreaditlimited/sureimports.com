import React, { useEffect, useRef } from 'react';
import { OrderTypeItems } from './order-types';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/_lib/utils';
import Link from 'next/link';

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
  const path = usePathname();
  const scrollref = useHorizontalScroll();

  return (
    <div
      ref={scrollref}
      className="hide-scrollbar flex gap-[10px] overflow-auto pt-[20px]"
    >
      {/* SAVED */}
      <Link
        href={'/dashboard/procurement/view-orders/saved'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div> Saved </div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* PENDING ORDERS */}
      <Link
        href={'/dashboard/procurement/view-orders/pending-orders'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>Pending Orders</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* APPROVED ORDERS */}
      <Link
        href={'/dashboard/procurement/view-orders/approved-orders'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>Approved Orders</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* PAY FOR SHIPPING */}
      <Link
        href={'/dashboard/procurement/view-orders/pay-for-shipping'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>Pay for Shipping</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* IN-TRANSIT */}
      <Link
        href={'/dashboard/procurement/view-orders/in-transit'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>In-Transit</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* READY FOR PICKUP */}
      <Link
        href={'/dashboard/procurement/view-orders/ready-for-pickup'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>Ready for Pickup</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* COMPLETED ORDERS */}
      <Link
        href={'/dashboard/procurement/view-orders/completed-orders'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>completed Orders</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>

      {/* ON-HOLD ORDERS */}
      <Link
        href={'/dashboard/procurement/view-orders/on-hold-orders'}
        key={1}
        className={cn(
          'rounded-[80px] border-slate-100 bg-white p-2 pl-4 pr-4 text-sm text-slate-800 hover:bg-gray-900/10 dark:hover:bg-slate-500',
          true && 'bg-indigo-800 text-white hover:bg-indigo-800/90',
        )}
      >
        <div className="flex gap-1.5">
          <div>On-Hold Orders</div>
          <div
            className={cn(
              'rounded-full bg-orange-500 px-1.5 text-[10px] text-white',
            )}
          >
            0
          </div>
        </div>
      </Link>
    </div>
  );
}

export default OrderTypes;
