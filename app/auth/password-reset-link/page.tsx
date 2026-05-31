import React, { Suspense } from 'react';
import PasswordResetForm from './components/PasswordResetForm';
import type { Metadata } from 'next';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reset Password | Sure Imports',
  description: 'Set a new password for your Sure Imports account.',
};

export default function PasswordResetPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
        <PasswordResetForm />
      </Suspense>
    </main>
  );
}
