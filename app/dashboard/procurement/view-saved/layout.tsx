'use client';

import { RecordCountProcurementProvider } from '@/app/context/RecordCountProcurementContext';
import Header from './components/header';
type UserLayoutProps = {
  children: React.ReactNode;
};

const ProcurementLayout = (props: UserLayoutProps) => {
  const { children } = props;
  return (
    <main className="si-workspace-plain">
      <RecordCountProcurementProvider>
        <Header />
        {children}
      </RecordCountProcurementProvider>
    </main>
  );
};

export default ProcurementLayout;
