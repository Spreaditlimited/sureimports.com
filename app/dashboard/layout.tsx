import { TokenValidator } from '@/lib/TokenValidator';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayoutProvider from './providers';
import { AuthProvider } from '@/lib/AuthContext';
import { RecordCountProcurementProvider } from '../context/RecordCountProcurementContext';
import Header from './procurement/view-orders/components/header';
import { LiveChatWidgetComponent } from '@/components/live-chat-widget';
import { checkAuth } from '@/lib/auth/checkAuth';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = cookies();
  // const token = (await cookieStore).get('token');

  // if (!token) {
  //   redirect('/auth/login');
  // }

  // Check if the user is authenticated
  const check = await checkAuth();
  if (!check) {
    redirect('/auth/login');
  }

  return (
    <>
      <AuthProvider>
        <DashboardLayoutProvider>{children}</DashboardLayoutProvider>
      </AuthProvider>
    </>
  );
}
