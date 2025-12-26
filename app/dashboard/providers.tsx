'use client';

import Sidebar from '@/components/dashboard/sidenavbar/components/sidebar';
import Header from '@/components/dashboard/header/header';
import { cn } from '@/_lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { ThemeProvider } from '@/components/dashboard/theme-provider';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlertProvider } from '@/app/context/AlertContext';
import { ModalProvider } from '@/app/context/ModalContext';
import { ShopCartProvider } from '@/app/context/ShopCartContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/uix/Loader';
import { RecordCountProcurementProvider } from '../context/RecordCountProcurementContext';
import { LiveChatWidgetComponent } from '@/components/live-chat-widget';

type UserLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayoutProvider = (props: UserLayoutProps) => {
  const { isOpen } = useSidebar();

  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  //   useEffect(() => {
  //     // Check if user data is loaded
  //     if (user !== undefined) {
  //       setIsLoading(false);
  //       if (!user?.email) {
  //         //router.push('/auth/login');
  //       }
  //     }
  //   }, [user, router]);

  //   useEffect(() => {
  //     if (user === undefined) {
  //       // User data is still loading
  //       setIsLoading(true); // Show loading spinner
  //       return;
  //     }

  //     // User data has loaded (user is either `null` or an object)
  //     setIsLoading(false);

  //     // Check authentication status
  //     if (user === null || !user.email) {
  //       router.push('/auth/login');
  //     }
  //   }, [user, router]);

  //   if (isLoading) {
  //     return <Loader />; // Render a loading indicator while checking auth
  //   }

  //   if (!user) {
  //     return null; // Render nothing while redirecting
  //   }

  return (
    <>
      {/* <LiveChatWidgetComponent /> */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ModalProvider>
          <div className="dashboard flex h-full min-h-screen border-collapse flex-col bg-white text-slate-900 dark:bg-black dark:text-white">
            <div className="a-auto z-20 flex">
              <Sidebar className="z-20 h-full bg-[#0E0E1F] text-white" />
            </div>
            <Header />

            <div className="mt-[90px] flex h-full min-h-screen flex-col overflow-hidden bg-slate-50 dark:bg-black lg:ml-[80px]">
              <main
                className={cn(
                  'hide-scrollbar h-full overflow-x-hidden overflow-y-scroll bg-slate-50 pb-1 transition-all duration-200 dark:bg-black',
                  isOpen && 'lg:ml-[156px]',
                )}
              >
                {/* Add the WhatsApp button */}
                <WhatsAppButton
                  waID="5VFC67ZUTMWPF1"
                  message="Hello! I'd like to ask about your services."
                  position="bottom-left"
                />

                <AlertProvider>
                  <RecordCountProcurementProvider>
                    <ShopCartProvider>{props.children}</ShopCartProvider>
                  </RecordCountProcurementProvider>
                </AlertProvider>
              </main>
            </div>
          </div>
        </ModalProvider>
      </ThemeProvider>
    </>
  );
};

export default DashboardLayoutProvider;
