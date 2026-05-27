import UpdateBankDetailsFrom from '@/components/dashboard/profile-update/bank-detail-form';
import ProfileUpdateForm from '@/components/dashboard/profile-update/profile-update-form';
import React from 'react';
import UpdatePassword from '../update-password/UpdatePassword';
import DeleteAccountForm from '@/components/dashboard/delete-account/detele-account';
import type { Metadata } from 'next';

let titlex = 'Profile Update';
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

function ProfileUpdate() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <ProfileUpdateForm />
      <div className="px-4 py-4">
        <div className="mb-4 rounded-xl bg-white dark:bg-black">
          <UpdatePassword />
        </div>
        <div className="mb-4 rounded-xl bg-white dark:bg-black">
          <UpdateBankDetailsFrom />
        </div>
        <div className="rounded-xl bg-white dark:bg-black">
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;
