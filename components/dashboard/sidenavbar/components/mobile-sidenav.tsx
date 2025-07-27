'use client';

import { useState, useEffect } from 'react';
import { MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
      <SheetContent side="left" className="w-[256px] bg-[#0E0E1F]">
        <div className="pb-6">
          <Image
            loading="lazy"
            src="/images/svg-logo-white.svg"
            alt="Logo"
            width={144}
            height={48}
            className="mb-4 ml-[25px] h-12 w-36 self-center"
            onClick={() => {
              router.push('/');
            }}
          />
          <div className="hide-scrollbar h-screen w-[256px] overflow-y-auto pb-24 pt-[25px]">
            <SideNav items={MobileNavItems} setOpen={setOpen} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
