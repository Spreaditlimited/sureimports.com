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
    <div className="bg-slate-50 dark:bg-black">
      <div className="z-10 pl-[25px] pt-[25px] text-[28px] font-bold text-slate-800 dark:bg-black dark:text-white">
        Profile Update
      </div>
      <div className="m-4 rounded-xl bg-white dark:bg-black">
        <ProfileUpdateForm />
      </div>
      <div className="m-4 rounded-xl bg-white dark:bg-black">
        <UpdatePassword />
      </div>
      <div className="m-4 rounded-xl bg-white dark:bg-black">
        <UpdateBankDetailsFrom />
      </div>
      <div className="m-[25px] rounded-xl bg-white dark:bg-black">
        <DeleteAccountForm />
      </div>
    </div>
  );
}

export default ProfileUpdate;
