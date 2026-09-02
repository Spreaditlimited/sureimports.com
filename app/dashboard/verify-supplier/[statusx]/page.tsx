import { redirect } from 'next/navigation';

export default function LegacySupplierVerificationStatusPage() {
  redirect('/dashboard/verify-supplier');
}
