import UpdatePasswordForm from '@/components/dashboard/update-password/update-password-form';
import React from 'react';

function UpdatePassword() {
  return (
    <div className="flex-grow overflow-auto pb-6">
      <div className="h-full rounded-xl bg-white dark:bg-black">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}

export default UpdatePassword;
