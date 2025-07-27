'use client';

import { RecordCountProcurementProvider } from '@/app/context/RecordCountProcurementContext';
import Header from './components/header';
import { AuthProvider } from '@/lib/AuthContext';
type UserLayoutProps = {
  children: React.ReactNode;
};

const ProcurementLayout = (props: UserLayoutProps) => {
  return (
    <main className="bg-slate-50 dark:bg-slate-800">
      <RecordCountProcurementProvider>
        <AuthProvider>
          <Header />
          {props.children}
        </AuthProvider>
      </RecordCountProcurementProvider>
    </main>
  );
};

export default ProcurementLayout;
