'use client';

import React from 'react';
import PaymentSection from '@/components/dashboard/pay-supplier/payment-section';
import PaymentData from '@/content/payments.json';

const SavedPaymentRequests = () => {
  return (
    <div className="flex w-full flex-col items-center bg-slate-50 px-4 dark:bg-slate-800 xl:flex-row xl:items-start">
      <PaymentSection initialOrders={PaymentData.PaidSupplier} />
    </div>
  );
};

export default SavedPaymentRequests;
