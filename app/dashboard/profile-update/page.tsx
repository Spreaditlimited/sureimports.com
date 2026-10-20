import AccountSecuritySettings from '@/components/dashboard/profile-update/AccountSecuritySettings';
import NigerianBankDetails from '@/components/dashboard/features/NigerianBankDetails';
import ProfileUpdateForm from '@/components/dashboard/profile-update/profile-update-form';
import React from 'react';
import styles from '@/components/dashboard/profile-update/Profile.module.css';
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
    <div className={`si-workspace ${styles.page}`}>
      <ProfileUpdateForm />
      <div className="si-workspace-body space-y-6">
        <AccountSecuritySettings />
        <NigerianBankDetails className={styles.panel} />
        <div className={styles.panel}>
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;
