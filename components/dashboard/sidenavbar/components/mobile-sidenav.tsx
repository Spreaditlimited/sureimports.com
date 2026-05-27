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

export const MobileSidebar = () => {
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
        <div className="flex items-center justify-center gap-2">
          <MenuIcon />
        </div>
      </SheetTrigger>

      <SheetContent side="left" className="w-[256px] bg-slate-900 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Dashboard Menu</SheetTitle>
        </SheetHeader>
        <div className="flex h-full flex-col">
          <div className="flex-shrink-0 pb-6 pt-6">
            <Image
              loading="lazy"
              src="/images/svg-logo-white.svg"
              alt="Logo"
              width={144}
              height={48}
              className="mb-4 ml-[25px] h-12 w-36 self-center hover:cursor-pointer"
              onClick={() => {
                router.push('/');
              }}
            />
          </div>

          <div className="sidebar-scrollable flex-1 overflow-y-auto px-3 pb-6">
            <SideNav items={MobileNavItems} setOpen={setOpen} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
