'use client';

import { RecordCountProcurementProvider } from '@/app/context/RecordCountProcurementContext';
import Header from './components/header';
type UserLayoutProps = {
  children: React.ReactNode;
};

const ProcurementLayout = (props: UserLayoutProps) => {
  const { children } = props;
  return (
    <main className="bg-slate-50 dark:bg-black">
      <RecordCountProcurementProvider>
        <Header />
        {children}
      </RecordCountProcurementProvider>
    </main>
  );
};

export default ProcurementLayout;
