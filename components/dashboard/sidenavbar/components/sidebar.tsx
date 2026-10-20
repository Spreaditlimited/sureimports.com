'use client';

import React from 'react';
import { SideNav } from './side-nav';
import { NavItems } from '../constants/side-nav';

import { cn } from '@/_lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { NavItem } from '../types';

interface SidebarProps {
  className?: string;
  items?: NavItem[];
  brand?: { name: string; href: string; logoUrl?: string };
}

export default function Sidebar({ className, items, brand }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const router = useRouter();
  return (
    <nav
      className={cn(
        `si-sidebar fixed z-10 hidden h-full border-r border-slate-800 lg:block`,
        isOpen ? 'h-full w-[236px]' : 'h-full w-[78px]',
        className,
      )}
    >
      <div className="bg-slate-900 ">
        {isOpen && (
          <div
            className="flex h-[72px] items-center hover:cursor-pointer"
            onClick={() => {
              router.push(brand?.href || '/');
            }}
          >
            {brand ? <span className="ml-[25px] max-w-40 break-words text-lg font-bold text-white">{brand.logoUrl ? <Image unoptimized src={brand.logoUrl} alt={brand.name} width={160} height={56} className="max-h-14 w-auto max-w-40 object-contain" /> : brand.name}</span> : <Image
              loading="lazy"
              src="/images/svg-logo-white.svg"
              alt="Logo"
              width={144}
              height={23}
              className="ml-[25px] h-auto w-36 self-center"
            />}
          </div>
        )}
        {!isOpen && (
          <div className="flex h-[72px] items-center justify-center">
            {brand ? <span className="text-xl font-bold text-white" title={brand.name}>{brand.name.slice(0, 1)}</span> : <Image
              loading="lazy"
              src="/favico.png"
              alt="Logo"
              width={30}
              height={30}
              className="items-center self-center"
            />}
          </div>
        )}
        <button
          type="button"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={isOpen}
          className={cn(
            'fixed top-[18px] ml-[218px] flex h-[40px] w-[40px] cursor-pointer justify-center rounded-full border border-slate-700 bg-slate-900 pt-2.5 text-3xl text-white ',
            !isOpen &&
              'top-[18px] z-10 ml-[58px] h-[40px] w-[40px] rotate-180 pt-2.5 text-3xl',
          )}
          onClick={toggle}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="sidebar-scrollable h-[calc(100dvh-72px)] space-y-4 overflow-y-auto overflow-x-visible bg-slate-900 pb-24 pt-3 ">
        <div className="px-3">
          <div className="space-y-1">
            <SideNav
              className="absolute text-background opacity-0"
              items={items ?? NavItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
