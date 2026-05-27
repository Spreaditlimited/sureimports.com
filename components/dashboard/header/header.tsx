'use client';

import { cn } from '@/_lib/utils';
import { MobileSidebar } from '../sidenavbar/components/mobile-sidenav';
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Search from './search';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';

const user = {
  name: 'Admin',
  image: '/images/avatar.png',
  email: 'spreaditglobal@gmail.com',
};

export default function Header() {
  const router = useRouter();
  const { isOpen } = useSidebar();
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
        <div className="flex flex-1">
          <div className={cn('flex gap-5 lg:hidden')}>
            <MobileSidebar />
            <div className="item-center flex md:hidden">
              <Image
                loading="lazy"
                src="/icons/search.svg"
                alt=""
                width={20}
                height={20}
                className="hidden h-5 w-5 shrink-0 text-white md:absolute"
              />
            </div>
          </div>
          <div className="flex flex-1 md:pl-5 lg:ml-[36px] lg:p-0">
            <Search />
          </div>
        </div>
        <div className="ml-4 flex items-center gap-[23px] max-xl:gap-[10px]">
          <div className="hidden items-center gap-[15px] lg:flex">
            <Button
              className="h-[50px] w-[52px] rounded-[19px] bg-slate-100 hover:bg-[#161629]/10 dark:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => {
                router.push('/dashboard/profile-update');
              }}
            >
              <Settings className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </Button>
          </div>
          <UserNav userz={user as any} />
        </div>
      </nav>
    </div>
  );
}
