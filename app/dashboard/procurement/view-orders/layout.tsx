'use client';

import { RecordCountProcurementProvider } from '@/app/context/RecordCountProcurementContext';
//import { useRecord } from '@/app/context/RecordCountContext';

type UserLayoutProps = {
  children: React.ReactNode;
};

const ProcurementLayout = (props: UserLayoutProps) => {
  return (
    <main className="bg-slate-50 dark:bg-black">
      <RecordCountProcurementProvider>
        {props.children}
      </RecordCountProcurementProvider>
    </main>
  );
};

export default ProcurementLayout;
