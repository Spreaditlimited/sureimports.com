'use client';

import { cn } from '@/_lib/utils';
import { MobileSidebar } from '../sidenavbar/components/mobile-sidenav';
import { UserNav } from './user-nav';
import { Button } from '@/components/ui/button';
import Search from './search';
import { useSidebar } from '@/hooks/useSidebar';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import ThemeToggle from '@/components/home/ThemeToggle';

export default function Header({ title, mobileNavigation, accountActions }: { title?: string; mobileNavigation?: React.ReactNode; accountActions?: React.ReactNode }) {
  const router = useRouter();
  const { isOpen } = useSidebar();
  const { user } = useAuth();

  return (
    <div
      className={cn(
        'si-dashboard-header',
        isOpen && 'si-dashboard-expanded',
      )}
    >
      <nav className="si-dashboard-topbar">
        <div className="flex flex-1">
          <div className="lg:hidden">{mobileNavigation ?? <MobileSidebar />}</div>
          <div className="flex min-w-0 flex-1">
            {title ? <span className="font-semibold text-slate-900 dark:text-white">{title}</span> : <Search />}
          </div>
        </div>
        <div className="ml-4 flex items-center gap-[23px] max-xl:gap-[10px]">
          <ThemeToggle lightSurface />
          {!accountActions && <div className="hidden items-center gap-[15px] lg:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account settings"
              title="Account settings"
              className="h-11 w-11 shrink-0 rounded-lg p-0"
              onClick={() => {
                router.push('/dashboard/profile-update');
              }}
            >
              <Settings className="h-5 w-5 shrink-0 text-slate-700 dark:text-slate-200" />
            </Button>
          </div>}
          {accountActions ?? <UserNav userz={user as any} />}
        </div>
      </nav>
    </div>
  );
}
