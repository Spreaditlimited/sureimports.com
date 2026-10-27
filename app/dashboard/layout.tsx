import '../dashboard-refinements.css';
import { redirect } from 'next/navigation';
import DashboardLayoutProvider from './providers';
import { checkAuth } from '@/lib/auth/checkAuth';
import type { Metadata } from 'next';
import { getAccountCountry, getFeatureRules } from '@/lib/features/server';
import { FeatureAvailabilityProvider } from '@/components/dashboard/features/FeatureAvailability';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard',
    template: '%s | Dashboard | Sure Imports',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const check = await checkAuth();
  if (!check) {
    redirect('/auth/login');
  }

  const [country, rules] = await Promise.all([getAccountCountry(check.pidUser), getFeatureRules()]);
  return <FeatureAvailabilityProvider country={country} rules={rules}><DashboardLayoutProvider>{children}</DashboardLayoutProvider></FeatureAvailabilityProvider>;
}
