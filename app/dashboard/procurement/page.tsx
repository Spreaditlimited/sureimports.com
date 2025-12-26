import React from 'react';
import ProcurementComponent from './components/ProcurementComponent';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileReminder from '@/components/dashboard/profile-reminder/ProfileReminder';
let titlex = 'Login Page';
let descriptionx =
  'Import from China. We guarantee the quality and accuracy of every product we source for you from China.';
export const metadata: Metadata = {
  title: titlex,
  description: descriptionx,
  openGraph: {
    title: titlex,
    description: descriptionx,
    images: [
      {
        url: 'https://www.sureimports.com/images/svg-logo-white.svg',
        width: 1200,
        height: 630,
        alt: 'Sure Imports',
      },
    ],
  },
};

const Procurement = () => {
  return (
    <div className="dark:bg-black">
      <ProcurementComponent />
    </div>
  );
};

export default Procurement;
