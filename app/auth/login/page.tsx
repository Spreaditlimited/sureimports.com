import React from 'react';
import LoginForm from './components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Sure Imports',
  description: 'Access your Sure Imports dashboard. We guarantee the quality and accuracy of every product we source for you from China.',
  openGraph: {
    title: 'Sign In | Sure Imports',
    description: 'Access your Sure Imports dashboard. We guarantee the quality and accuracy of every product we source for you from China.',
    images: [
      {
        url: 'https://www.sureimports.com/images/sure-imports-social-card.png',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950">
      <LoginForm />
    </main>
  );
}
