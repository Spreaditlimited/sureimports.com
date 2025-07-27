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
            {Item.count > 0 && path != Item.href && (
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
