'use client';

import { cn } from '@/_lib/utils';
import { MobileSidebar } from '../sidenavbar/components/mobile-sidenav';
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Search from './search';
import { useSidebar } from '@/hooks/useSidebar';
import { ModeToggle } from './mode-toggle';
import { useTheme } from 'next-themes';
import { Bell, Bolt } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const user = {
  name: 'Admin',
  image: '/images/avatar.png',
  email: 'spreaditglobal@gmail.com',
};

export default function Header() {
  const router = useRouter();
  const { isOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-10 h-[90px] backdrop-blur lg:ml-[78px]',
        'bg-white dark:bg-[#000000] dark:text-white',
        'supports-backdrop-blur:bg-white/60 dark:supports-backdrop-blur:bg-gray-800/60',
        isOpen && 'transition-all duration-200 lg:ml-[236px]',
      )}
    >
      <nav className="mx-4 flex h-[90px] items-center justify-between py-[20px] lg:ml-0">
        <div className="flex">
          <div className={cn('flex gap-5 lg:hidden')}>
            <MobileSidebar />
            <div className="item-center flex md:hidden">
              <Image
                loading="lazy"
                src={
                  theme === 'dark'
                    ? '/icons/search-dark.svg'
                    : '/icons/search.svg'
                }
                alt=""
                width={20}
                height={20}
                className="hidden h-5 w-5 shrink-0 text-white md:absolute"
              />
            </div>
          </div>
          <div className="flex md:pl-5 lg:ml-[36px] lg:p-0">
            <Search />
          </div>
        </div>
        <div className="flex items-center gap-[23px] max-xl:gap-[10px]">
          <ModeToggle />
          <div className="hidden items-center gap-[15px] lg:flex">
            <Button
              className="h-[50px] w-[52px] rounded-[19px] bg-slate-100 hover:bg-[#161629]/10 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => {
                router.push('/dashboard/message/message-box');
              }}
            >
              {theme === 'dark' ? (
                <Bell />
              ) : (
                <Image
                  src={
                    theme === 'dark'
                      ? '/icons/notification-dark.svg'
                      : '/icons/notification.svg'
                  }
                  alt="Logo"
                  width={60}
                  height={60}
                />
              )}
            </Button>
            <Button
              className="h-[50px] w-[52px] rounded-[19px] bg-slate-100 hover:bg-[#161629]/10 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => {
                router.push('/dashboard/profile-update');
              }}
            >
              {theme === 'dark' ? (
                <Bolt />
              ) : (
                <Image
                  src={
                    theme === 'dark'
                      ? '/icons/settings-dark.svg'
                      : '/icons/settings.svg'
                  }
                  alt="Logo"
                  width={60}
                  height={60}
                />
              )}
            </Button>
          </div>
          <UserNav userz={user as any} />
        </div>
      </nav>
    </div>
  );
}
