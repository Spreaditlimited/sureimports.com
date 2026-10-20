'use client';

import { DashboardFeatureBoundary } from '@/components/dashboard/features/FeatureAvailability';
import Sidebar from '@/components/dashboard/sidenavbar/components/sidebar';
import Header from '@/components/dashboard/header/header';
import { cn } from '@/_lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { AlertProvider } from '@/app/context/AlertContext';
import { ModalProvider } from '@/app/context/ModalContext';
import { ShopCartProvider } from '@/app/context/ShopCartContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { RecordCountProcurementProvider } from '../context/RecordCountProcurementContext';

type UserLayoutProps = {
  children: React.ReactNode;
  navigation?: React.ReactNode;
  topbar?: React.ReactNode;
  hideSureImportsSupport?: boolean;
  tenantScoped?: boolean;
};

const DashboardLayoutProvider = (props: UserLayoutProps) => {
  const { isOpen } = useSidebar();

  return (
    <>

      <ModalProvider>
        <div className="dashboard si-dashboard-shell">
          <a className="si-dashboard-skip" href="#dashboard-main">Skip to content</a>
          <div className="a-auto z-20 flex">
            {props.navigation ?? (
              <Sidebar className="z-20 h-full bg-[#0E0E1F] text-white" />
            )}
          </div>
          {props.topbar ?? <Header />}

          <div className="si-dashboard-content">
            <main
              id="dashboard-main"
              tabIndex={-1}
              className={cn(
                'si-dashboard-main',
                isOpen && 'si-dashboard-expanded',
              )}
            >
              {/* Add the WhatsApp button */}
              {!props.hideSureImportsSupport && (
                <WhatsAppButton
                  waID="5VFC67ZUTMWPF1"
                  message="Hello! I'd like to ask about your services."
                  position="bottom-left"
                />
              )}

              <AlertProvider>
                <RecordCountProcurementProvider
                  tenantScoped={props.tenantScoped}
                >
                  <DashboardFeatureBoundary><ShopCartProvider>{props.children}</ShopCartProvider></DashboardFeatureBoundary>
                </RecordCountProcurementProvider>
              </AlertProvider>
            </main>
          </div>
        </div>
      </ModalProvider>
    </>
  );
};

export default DashboardLayoutProvider;
