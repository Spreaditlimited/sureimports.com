import React from 'react';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Sure Imports',
  description: 'Reset your Sure Imports account password.',
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      <ForgotPasswordForm />
    </main>
  );
}
