'use client';

import { useState, useEffect } from 'react';
import { MenuIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SideNav } from './side-nav';
import { MobileNavItems } from '../constants/side-nav';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { NavItem } from '../types';

export const MobileSidebar = ({ items, brand }: { items?: NavItem[]; brand?: { name: string; href: string; logoUrl?: string } }) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" aria-label="Open dashboard menu" className="flex h-11 w-11 items-center justify-center gap-2">
          <MenuIcon />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="si-sidebar w-[280px] max-w-[calc(100vw-2rem)] bg-slate-900 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Dashboard Menu</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          <div className="flex-shrink-0 pb-6 pt-6">
            {brand ? <a href={brand.href} className="ml-[25px] block max-w-40 text-lg font-bold text-white">{brand.logoUrl ? <Image unoptimized src={brand.logoUrl} alt={brand.name} width={160} height={56} className="max-h-14 w-auto max-w-40 object-contain" /> : brand.name}</a> : <Image
              loading="lazy"
              src="/images/svg-logo-white.svg"
              alt="Logo"
              width={144}
              height={23}
              className="mb-4 ml-[25px] h-auto w-36 self-center hover:cursor-pointer"
              onClick={() => {
                router.push('/');
              }}
            />}
          </div>

          <div className="sidebar-scrollable flex-1 overflow-y-auto px-3 pb-6">
            <SideNav items={items ?? MobileNavItems} setOpen={setOpen} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
