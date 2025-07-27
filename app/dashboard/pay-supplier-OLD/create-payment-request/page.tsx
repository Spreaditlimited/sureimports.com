import CreatePaymentForm from '@/components/dashboard/pay-supplier/create-payment-form';
import React from 'react';

function ProfileUpdate() {
  return (
    <div className="bg-slate-50 dark:bg-slate-800">
      <div className="pl-[25px] pt-[25px] text-[28px] font-bold text-slate-800 dark:text-slate-200">
        Create Payment Request{' '}
        <span className="text-base font-normal text-slate-800">
          (Pay Supplier)
        </span>
      </div>
      <div className="m-6 rounded-xl bg-white dark:bg-[#161629]">
        <CreatePaymentForm />
      </div>
    </div>
  );
}

export default ProfileUpdate;
