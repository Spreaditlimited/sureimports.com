import UpdateBankDetailsFrom from '@/components/dashboard/profile-update/bank-detail-form';
import ProfileUpdateForm from '@/components/dashboard/profile-update/profile-update-form';
import React from 'react';
import UpdatePassword from '../update-password/UpdatePassword';
import DeleteAccountForm from '@/components/dashboard/delete-account/detele-account';
import Template from '@/components/uix/template';

function Page() {
  return (
    <div className="bg-slate-50 dark:bg-slate-800">
      <div className="z-10 pl-[25px] pt-[25px] text-[28px] font-bold text-slate-800 dark:text-white">
        Template
      </div>
      <div className="m-4 rounded-xl bg-white dark:bg-[#161629]">
        <Template />
      </div>
    </div>
  );
}

export default Page;
