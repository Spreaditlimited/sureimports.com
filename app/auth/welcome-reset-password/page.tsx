import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import MigrationPasswordResetForm from './components/MigrationPasswordResetForm';

export const metadata: Metadata = {
  title: 'Account Update | Sure Imports',
  description: 'Securely update your password to access the new Sure Imports dashboard.',
};

export default function MigrationResetPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      <Suspense 
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        }
      >
        <MigrationPasswordResetForm />
      </Suspense>
    </main>
  );
}
