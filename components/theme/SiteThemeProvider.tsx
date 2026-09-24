'use client';

import { ThemeProvider } from '@/components/dashboard/theme-provider';

export default function SiteThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
