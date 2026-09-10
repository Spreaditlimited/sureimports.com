'use client';

import { RecordCountProcurementProvider } from '@/app/context/RecordCountProcurementContext';
//import { useRecord } from '@/app/context/RecordCountContext';

type UserLayoutProps = {
  children: React.ReactNode;
};

const ProcurementLayout = (props: UserLayoutProps) => {
  const { children } = props;
  return (
    <main className="bg-slate-50 dark:bg-black">
      <RecordCountProcurementProvider>
        {children}
      </RecordCountProcurementProvider>
    </main>
  );
};

export default ProcurementLayout;
