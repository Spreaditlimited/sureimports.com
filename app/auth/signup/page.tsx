import React from 'react';
import SignUpForm from './components/SignUpForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create an Account | Sure Imports',
  description: 'Join Sure Imports and start managing your global import network. We guarantee the quality and accuracy of every product we source for you from China.',
  openGraph: {
    title: 'Create an Account | Sure Imports',
    description: 'Join Sure Imports and start managing your global import network. We guarantee the quality and accuracy of every product we source for you from China.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      <SignUpForm />
    </main>
  );
}