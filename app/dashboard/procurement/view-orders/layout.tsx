'use client';

import { RecordCountProcurementProvider } from '@/app/context/RecordCountProcurementContext';
//import { useAuth } from '@/lib/AuthContext';
//import { useRecord } from '@/app/context/RecordCountContext';

import { AuthProvider } from '@/lib/AuthContext';
type UserLayoutProps = {
  children: React.ReactNode;
};

const ProcurementLayout = (props: UserLayoutProps) => {
  return (
    <main className="bg-slate-50 dark:bg-black">
      <AuthProvider>
        <RecordCountProcurementProvider>
          {props.children}
        </RecordCountProcurementProvider>
      </AuthProvider>
    </main>
  );
};

export default ProcurementLayout;
