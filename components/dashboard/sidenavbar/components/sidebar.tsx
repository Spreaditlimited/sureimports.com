'use client';

import React, { useState } from 'react';
import { SideNav } from './side-nav';
import { NavItems } from '../constants/side-nav';

import { cn } from '@/_lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  //const router = useRouter();

  ////////////////// LOGOUT FUNCTION //////////////////
  const { user, logout } = useAuth();
  const router = useRouter();
  //test 1
  const Logoutx = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    router.push('../auth/login');
  };
  ////////////////// LOGOUT FUNCTION box //////////////////

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `fixed z-10 hidden h-full border-r lg:block`,
        status && 'duration-500',
        isOpen ? 'h-full w-[236px]' : 'h-full w-[78px]',
        className,
      )}
    >
      <div className="">
        {isOpen && (
          <div
            className="flex h-[90px] items-center hover:cursor-pointer"
            onClick={() => {
              router.push('/');
            }}
          >
            <Image
              loading="lazy"
              src="/images/svg-logo-white.svg"
              alt="Logo"
              width={72}
              height={10}
              className="ml-[25px] h-12 w-36 self-center"
            />
          </div>
        )}
        {!isOpen && (
          <div className="flex h-[90px] items-center justify-center">
            <Image
              loading="lazy"
              src="/favico.png"
              alt="Logo"
              width={30}
              height={30}
              className="items-center self-center"
            />
          </div>
        )}
        <button
          className={cn(
            'fixed top-[25px] ml-[218px] flex h-[40px] w-[40px] cursor-pointer justify-center rounded-full border bg-background pt-2.5 text-3xl text-foreground duration-500 dark:bg-gray-800 dark:text-white',
            !isOpen &&
              'top-[25px] z-10 ml-[58px] h-[40px] w-[40px] rotate-180 pt-2.5 text-3xl',
          )}
          onClick={handleToggle}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="hide-scrollbar h-full space-y-4 overflow-x-visible overflow-y-scroll bg-[#161629] pb-24 pt-[25px] backdrop-blur-[151.85px]">
        <div className="px-3">
          <div className="mt-3 space-y-1">
            <SideNav
              className="absolute text-background opacity-0"
              items={NavItems}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
