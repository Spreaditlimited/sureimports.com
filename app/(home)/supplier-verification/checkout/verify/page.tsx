import { Suspense } from 'react';
import VerificationReturnClient from './VerificationReturnClient';

export default function SupplierVerificationPaymentReturnPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] bg-slate-50" />}>
      <VerificationReturnClient />
    </Suspense>
  );
}
