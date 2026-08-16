'use client';

import { usePathname } from 'next/navigation';

import { ThemeProvider } from '@/components/dashboard/theme-provider';

export default function SiteThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard =
    pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  return (
    <ThemeProvider forcedTheme={isDashboard ? 'light' : undefined}>
      {children}
    </ThemeProvider>
  );
}
